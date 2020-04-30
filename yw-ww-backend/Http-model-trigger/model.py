import azure.functions as func
import networkx as nx
import numpy as np
import pandas as pd
import os
import json
from ..shared_code import azure_functions
from ..shared_code import cleaning_functions
from ..shared_code import distance_functions
from ..shared_code import network_prep_functions
from ..shared_code import production_plan_functions


def main(req: func.HttpRequest) -> func.HttpResponse:

    #get required secrets
    conn_str = os.getenv("conn_str")

    # pull files and modify raw data into required format

    production_file = azure_functions.stream_blob_to_df(conn_str, "data-inputs", "sludge-production-v0.1.csv", "CSV")
    production_file["Name"] = production_file["Name"].str[:2]

    reference_file = azure_functions.stream_blob_to_df(conn_str, "data-inputs", "yw_reference_tables.xlsx", "XLSX")

    distances = reference_file["Distance"]
    transport_costs = reference_file["Transport-cost"]
    chemicals = reference_file["Chemicals"]
    elec_use = reference_file["Electricity-use"]
    elec_gen = reference_file["Electricity-generation"]
    recycling = reference_file["Recycling"]
    temp = reference_file["Temp"]
    liquors = reference_file["Liquors"]
    tp = reference_file["Third-party"]

    ref_sheets = [distances, transport_costs, chemicals, elec_use, elec_gen, recycling, temp, liquors, tp]

    for i in ref_sheets:
        i["Site"] = i["Site"].str[:2]

    param_file = azure_functions.stream_blob_to_df(conn_str, "data-inputs", "sludge-params.csv", "CSV")

    liquid_km_param = param_file.loc[param_file["Param"] == "liquid_km", :].values[0][1]
    cake_km_param = param_file.loc[param_file["Param"] == "cake_km", :].values[0][1]

    # Build base tables

    gate_fees = cleaning_functions.calculate_gate_fees(chemicals, elec_use, temp, liquors)
    elec_fees = cleaning_functions.calculate_electricity_gen_fees(elec_gen)
    recyling_fees = cleaning_functions.calculate_recyling_fees(recycling)

    cost_data = cleaning_functions.create_cost_data(transport_costs, gate_fees, tp)
    capacity_data = cleaning_functions.create_capacity_data(production_file)

    var_cc_data = cleaning_functions.create_variable_cost_capacity_data(elec_fees, recyling_fees, capacity_data)

    ind_costs = cleaning_functions.calculate_indigenous_costs(gate_fees, var_cc_data)

    # create site df

    sites = network_prep_functions.create_site_df(production_file)

    # Create list of node tuples

    node_df = network_prep_functions.create_node_df(sites, production_file)
    node_tuples = [(i["Name"], {"demand" : i["P"]}) for _, i in node_df.iterrows()]

    # create base edges

    all_edges = network_prep_functions.create_edges_df(sites)
    all_edges = network_prep_functions.add_standard_costs_and_caps(all_edges, cost_data, capacity_data)
    all_edges = network_prep_functions.add_variable_costs_and_caps(all_edges, var_cc_data)

    # add in weightings for distances

    distance_df = distance_functions.create_distance_df(distances)
    driver_modifier = distance_functions.create_driver_load_adjusted_distance(distance_df, liquid_km_param, cake_km_param)

    all_edges = (all_edges.merge(driver_modifier.loc[:, ["Start-End" , "LAD_Loads_KM_TDS"]], on = "Start-End", how = "left")
                .fillna({"LAD_Loads_KM_TDS" : 1})
                .drop("Start-End", axis = 1))

    all_edges["Total_Cost"] = all_edges["Transport_Cost"] + all_edges["Cost"]
    all_edges["Total_Cost"] = all_edges["Total_Cost"] * all_edges["LAD_Loads_KM_TDS"]
    all_edges = all_edges.drop("LAD_Loads_KM_TDS", axis = 1)

    #create final edge tuples

    edge_tuples = [(i["From"], i["To"], {"capacity" : round(i["Capacity"], 1), "weight" : round(i["Total_Cost"])}) for _, i in all_edges.iterrows()]

    # create and run graph

    G = network_prep_functions.create_multi_network(node_tuples, edge_tuples)
    flowCost, mincostFlow = nx.network_simplex(G)

    # create production plan

    flow_dict = production_plan_functions.create_flow_dict(mincostFlow)
    node_names = production_plan_functions.get_node_names(node_df)
    flow_df, flow_df_t, flow_cols = production_plan_functions.create_flow_df(flow_dict, node_names, production_file, sites, ind_costs)
    export_sites, total_imports, total_exports = production_plan_functions.get_site_imports_exports(flow_df, flow_df_t)
    flow_costs_grouped = production_plan_functions.get_flow_costs(flow_df_t, flow_cols, transport_costs)
    movement_df = production_plan_functions.site_to_site_movements(flow_dict)
    export_metrics_df = production_plan_functions.create_export_metrics(distance_df, movement_df)
    flow_cost_df = production_plan_functions.create_production_plan(flow_df_t, total_imports, total_exports, flow_costs_grouped, 
                                        export_sites, var_cc_data, movement_df, export_metrics_df)

    # push to blob store

    azure_functions.stream_df_to_blob(conn_str, "data-outputs", "pp_test.csv", flow_cost_df)

    # get distance information

    metrics = production_plan_functions.state_distance_metrics(flow_cost_df, liquid_km_param, cake_km_param)
    info_string = json.dumps(metrics)

    return func.HttpResponse(info_string)
