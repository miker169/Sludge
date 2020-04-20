import logging
import azure.functions as func
import numpy as np
import pandas as pd
from ..shared_code.model_helpers import *
import os


def main(req: func.HttpRequest) -> func.HttpResponse:

    #get required secrets
    conn_str = os.getenv('conn_str')

    # pull file and modify raw data into required format

    raw_file = stream_blob_to_df(conn_str, "data-inputs", "sludge-example-network-v0.1.csv")
    site_names = raw_file["Name"].to_list()
    raw_file["Name"] = raw_file["Name"].str[:2]

    #Check TP requirements and build base tables
    tp_req, tp_demand, adjusted_production = third_party_calcs(raw_file)
    transport_costs = build_transport_costs("each-run", tp_demand, site_names, raw_file)
    capacities = build_capacities(raw_file, tp_demand)
    ind_costs = calculate_indigenous_costs(raw_file)
    all_sites = create_tp_dep_site_df(tp_req, raw_file)

    # Create list of node tuples
    node_df, node_tuples = create_node_tuples(all_sites, raw_file, adjusted_production, tp_demand)

    # create list of edge tuples
    liquid_gate_edges = pd.DataFrame()
    gate_liquid_edges = pd.DataFrame()

    for i in [1, 2]:
        a = define_site_to_gate_edges("liquid", all_sites, i)
        liquid_gate_edges = liquid_gate_edges.append(a)
    
    for i in [2, 3, 4]:
        a = define_gate_to_site_edges("liquid", all_sites, i)
        gate_liquid_edges = gate_liquid_edges.append(a)

    solid_gate_edges = define_site_to_gate_edges("solid", all_sites, 3)
    gate_solid_edges = define_gate_to_site_edges("solid", all_sites, 4)
    tp_edges = define_dw_to_tp_edges(all_sites)
    sink_edges = create_sink_edges(all_sites)

    edge_tuples = create_edge_tuples(liquid_gate_edges, solid_gate_edges, gate_liquid_edges, gate_solid_edges, tp_edges, sink_edges, transport_costs, capacities)

    # create and run graph

    G = create_directed_graph(node_tuples, edge_tuples)
    flowCost, mincostFlow = run_min_cost(G)

    # create production plan

    node_names = get_required_nodes(node_df)
    flow_cols, flow_df = create_flow_df(mincostFlow, node_names, all_sites, ind_costs)
    flow_costs = get_flow_costs(flow_df, flow_cols, transport_costs)
    production_plan = create_production_plan(flow_df, flow_costs)

    # push to blob store

    stream_df_to_blob(conn_str,
    "data-outputs",
    "pp_test.csv",
    production_plan)

    return func.HttpResponse("Job Complete!")
