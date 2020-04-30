import numpy as np
import pandas as pd
from math import ceil


def create_flow_dict(nested_flow_dict):

    flow_dict = {}

    for i in nested_flow_dict:
        run_dict = {}
        for j, k in nested_flow_dict[i].items():
            total = 0
            for _, l in k.items():
                total += l
                run_dict[j] = total
        flow_dict[i] = run_dict
        
    return flow_dict


def get_node_names(node_df):

    node_names = node_df.loc[~node_df["Name"].str.contains("-LG|-SG|-JG|-RG|-EG|Sink"), "Name"].tolist()

    multi_gate_nodes = node_df.loc[node_df["Name"].str.contains("-SG"), "Name"].tolist()

    multi_gate_nodes_list = [x[:2] + "-LG" for x in multi_gate_nodes] + [x[:2] + "-SG" for x in multi_gate_nodes]

    node_names = node_names + multi_gate_nodes_list
    
    return node_names


def create_flow_df(min_cost_dict, node_names, production_df, site_df, ind_cost_df):

    flow_df = pd.DataFrame(min_cost_dict).reset_index(drop = False).rename(columns = {"index" : "End"})
    flow_df = flow_df.loc[flow_df["End"] != "Sink", :]

    flow_df.loc[:, "End"] = np.where(flow_df["End"].str.contains("-R3"),
                                    flow_df["End"],
                                    flow_df["End"].str[:2])

    flow_df = flow_df.groupby("End", as_index = False).sum().set_index('End')

    production = production_df.loc[:, ["Name", "P"]].copy()

    flow_df_t = flow_df.transpose().reset_index(drop = False).rename(columns = {"index" : "Name"})
    flow_df_t = flow_df_t.loc[flow_df_t["Name"].isin(node_names)].reset_index(drop = True)
    flow_df_t = (flow_df_t.merge(site_df, on = "Name", how = "left")
             .merge(ind_cost_df, on = "Name", how = "left")
            .merge(production, on = "Name", how = "left"))

    flow_cols = flow_df_t.sort_values("Rank").loc[(flow_df_t["Rank"] > 1) & 
                                              (~flow_df_t["Name"].str.contains("-LG|-SG|-JG|-EG|-RG")), "Name"].tolist()

    flow_df_t = flow_df_t.loc[:, ["Name", "Rank", "P", "Ind_Cost"] + flow_cols]
    flow_df_t = flow_df_t.fillna({"P" : 0,
                             "Ind_Cost" : 0})

    return flow_df, flow_df_t, flow_cols


def get_site_imports_exports(flow_df, flow_df_t):
    
    export_sites = flow_df.loc[:, ~flow_df.columns.str.contains("-LG|-SG|-JG|-EG|-RG")].columns.tolist()

    import_sites = flow_df.reset_index(drop = False)["End"].tolist()

    total_imports = flow_df.loc[:, export_sites]
    total_imports = (total_imports.sum(axis=1).tolist())
    total_imports = pd.DataFrame(zip(import_sites, total_imports), columns = ["Name", "Imported"])
    
    total_exports = flow_df_t.loc[flow_df_t["Name"].isin(export_sites), ["Name"] + import_sites]
    total_exports = (total_exports.sum(axis=1).tolist())
    total_exports = pd.DataFrame(zip(export_sites, total_exports), columns = ["Name", "Exported"])
    
    return export_sites, total_imports, total_exports


def get_flow_costs(flow_df_t, flow_cols, transport_costs_df):
    
    transport_costs_df = (transport_costs_df.drop(["ST", "Rank", "ID"], axis = 1)
                         .rename(columns = {"Site" : "Name"}))

    transport_costs_df = pd.melt(transport_costs_df, id_vars=['Name'], var_name='End', value_name='Cost')
    transport_costs_df["End"] = transport_costs_df["End"].str[:2]
    transport_costs_df["Start-End"] = transport_costs_df["Name"] + "-" + transport_costs_df["End"]

    flow_costs = pd.melt(flow_df_t,  id_vars=['Name'], value_vars = flow_cols, var_name='End', value_name='Movement')

    flow_costs.loc[:, "Start-End"] = np.where(flow_costs["Name"].str.contains("-"), 
                                              flow_costs["Name"], 
                                              flow_costs["Name"] + "-" + flow_costs["End"])

    flow_costs = (flow_costs.merge(transport_costs_df.loc[:, ["Start-End", "Cost"]], on = "Start-End", how = "left")
                 .fillna({"Imported" : 0}))

    flow_costs.loc[:, "Ext_Cost"] = flow_costs["Movement"] * round(flow_costs["Cost"])

    flow_costs_grouped = flow_costs.groupby("Name", as_index = False).agg({"Ext_Cost" : "sum"})
    
    return flow_costs_grouped


def site_to_site_movements(min_cost_dict):
    
    movement_df = pd.DataFrame()

    for j, k in min_cost_dict.items():
        for l, m in k.items():
            if m > 0:
                data = pd.DataFrame(zip([j], [l], [m]), columns = ["From", "To", "Amount"])
                movement_df = movement_df.append(data)

    movement_df = movement_df.loc[(~movement_df["From"].str.contains("-LG|-SG|-JG|-EG|-RG")) & 
                          (~movement_df["To"].str.contains("Sink")), :]

    movement_df["To"] = movement_df["To"].str[:2]
    movement_df["Start-End"] = movement_df["From"] + "-" + movement_df["To"]
    
    return movement_df


def create_export_metrics(distance_df, movement_df):
    
    trip_df = pd.DataFrame(zip([1, 2, 3, 4, 5, 6, 7, 8], 
                               [1, 3, 5, 7, 9, 11, 13, 15]), 
                           columns = ["Rounded_Trips", "Adjusted_Trips"])
    
    export_metrics = (distance_df.loc[:, ['Start-End', "TDS_Per_Trip", "Distance"]]
                    .copy())
    
    export_metrics = (export_metrics.merge(movement_df, on = "Start-End", how = "left")
                     .dropna(subset = ["From"]))
    
    export_metrics["Trips"] = export_metrics["Amount"] / export_metrics["TDS_Per_Trip"]
    
    export_metrics["Rounded_Trips"] = export_metrics["Trips"].apply(lambda x: ceil(x))
    
    export_metrics = export_metrics.merge(trip_df, on = "Rounded_Trips", how = "left")
    
    export_metrics["Distance_Covered"] = export_metrics["Adjusted_Trips"] * export_metrics["Distance"]
    
    export_metrics = (export_metrics.groupby("From", as_index = False)
                      .agg({"Distance_Covered" : "sum",
                            "Adjusted_Trips" : "sum",
                           "TDS_Per_Trip" : "mean"})
                     .rename(columns = {"From" : "Name"}))
    
    export_metrics = export_metrics.loc[:, ["Name", "TDS_Per_Trip", "Adjusted_Trips", "Distance_Covered"]]
    
    return export_metrics


def calculate_capacity_based_modifiers(flow_cost_df, var_cc_df):
    
    variable_sites = flow_cost_df.loc[((flow_cost_df["Rank"] == 4) | 
                        (flow_cost_df["Name"].str.contains("-R3"))) & 
                        (flow_cost_df["Imported"] > 0), ["Name", "Imported"]]

    variable_sites.loc[:, "To"] = variable_sites["Name"].str[:2]

    var_data = var_cc_df.rename(columns = {"Site" : "To"})

    variable_sites = variable_sites.merge(var_data, on = "To", how = "left")
    
    sites = variable_sites.loc[:, ["To", "Type"]].copy().drop_duplicates()

    full_fees = []

    for _, j in sites.iterrows():

        total = 0

        imported = (variable_sites.loc[(variable_sites["To"] == j["To"]) & 
                                (variable_sites["Type"] == j["Type"]), "Imported"].drop_duplicates().values[0])
        capacities = (variable_sites.loc[(variable_sites["To"] == j["To"]) & 
                                (variable_sites["Type"] == j["Type"]), "Capacity"].to_list())
        fees = (variable_sites.loc[(variable_sites["To"] == j["To"]) & 
                                (variable_sites["Type"] == j["Type"]), "Gate_Fee"].to_list())

        imported_val = imported.copy()

        for k, l in zip(capacities, fees):
            rem = k - imported
            if rem > 0:
                total += imported * l
                break
            else:
                total += (imported - abs(rem)) * l
                imported = abs(rem)
                continue
        full_fees.append(tuple([j["To"], j["Type"], imported_val, total]))

    fee_df = (pd.DataFrame(full_fees, columns = ["To", "Type", "Imported", "Cost"])
             .groupby(["To", "Imported"], as_index = False)
             .agg({"Cost" : "sum"})
             .rename(columns = {"Cost" : "Cost_Modifier"}))

    fee_df["Import_Modifier"] = fee_df["Cost_Modifier"] / fee_df["Imported"]
    
    return fee_df


def create_production_plan(flow_df_t, total_imports, total_exports, flow_costs_grouped, 
                           export_sites, variable_data_df, site_movements_df, export_metrics_df):
    
    #create base df
    flow_cost_df = (flow_df_t.merge(total_imports, on = "Name", how = "left")
                    .fillna({"Imported" : 0})
                    .merge(total_exports, on = "Name", how = "left")
                    .fillna({"Exported" : 0})
                    .merge(flow_costs_grouped, on = "Name", how = "left")
                    .fillna({"Cost" : 0})
                   .loc[flow_df_t["Name"].isin(export_sites), :])

    # adjust for the variable cost from energy production and recyling routes
    var_fee_df = calculate_capacity_based_modifiers(flow_cost_df, variable_data_df)
    
    var_modifiers = (site_movements_df.merge(var_fee_df, on = "To", how = "left")
                    .dropna(subset = ["Import_Modifier"]))
    var_modifiers["Adj_Cost"] = var_modifiers["Amount"] * var_modifiers["Import_Modifier"]
    var_modifiers = (var_modifiers.loc[:, ["From", "Adj_Cost"]]
                    .rename(columns = {"From" : "Name"})
                    .groupby("Name", as_index = False)
                    .agg({"Adj_Cost" : "sum"}))
    
    flow_cost_df = (flow_cost_df.merge(var_modifiers, on = "Name", how = "left")
                   .fillna({"Adj_Cost" : 0}))
    
    # add in distance metrics
    
    flow_cost_df = (flow_cost_df.merge(export_metrics_df, on = "Name", how = "left")
                   .fillna({"Distance_Covered" : 0, "Adjusted_Trips" : 0, "TDS_Per_Trip" : 0}))
    
    flow_cost_df["Loads"] = flow_cost_df["Exported"] / flow_cost_df["TDS_Per_Trip"]
    
    flow_cost_df = flow_cost_df.fillna({"Loads" : 0})

    # create final cost columns
    flow_cost_df["Ext_Cost"] = round(flow_cost_df["Ext_Cost"] + flow_cost_df["Adj_Cost"], 2)
    flow_cost_df.drop("Adj_Cost", axis = 1, inplace = True)
    flow_cost_df.loc[:, "Ind_Cost"] = round(flow_cost_df["Ind_Cost"], 2)
    flow_cost_df.loc[:, "Final_Cost"] = round(flow_cost_df["Ind_Cost"] + flow_cost_df["Ext_Cost"], 2)
    
    # filter out unwanted sites
    flow_cost_df = flow_cost_df.loc[~flow_cost_df["Name"].str.contains("-R3"), :]
    
    r3_cols = [x for x in list(flow_cost_df.columns) if "-R3" in x]
    
    for i in r3_cols:
        if flow_cost_df[i].sum() == 0:
            flow_cost_df = flow_cost_df.drop(i, axis = 1)
    
    return flow_cost_df


def state_distance_metrics(flow_cost_df, liquid_km, solid_km):
    
    liquid_sites = flow_cost_df.loc[flow_cost_df["Rank"] < 3, ["Loads", "Distance_Covered", "Adjusted_Trips"]].copy()
    cake_sites = flow_cost_df.loc[flow_cost_df["Rank"] == 3, ["Loads", "Distance_Covered", "Adjusted_Trips"]].copy()
    
    liquid_loads = round(liquid_sites.loc[:, "Loads"].sum(), 2)
    cake_loads = round(cake_sites.loc[:, "Loads"].sum(), 2)
    
    loads = (f"The number of loads carried for liquid sites was {liquid_loads} \n"
             f"The number of loads carried for cake sites was {cake_loads} \n")
    
    liquid_distance = round(liquid_km - liquid_sites.loc[:, "Distance_Covered"].sum(), 2)
    cake_distance = round(solid_km - cake_sites.loc[:, "Distance_Covered"].sum(), 2)
    
    if liquid_distance or cake_distance < 0:
        distance = (f"Warning: Site type exceeded available driver KMs \n"
            f"The number of KMs travelled for liquid sites was {abs(liquid_distance)} over target \n"
             f"The number of KMs travelled for cake sites was {abs(cake_distance)} over target")
        
    else:
        distance = (f"The number of KMs travelled for liquid sites was {liquid_distance} under target \n"
             f"The number of KMs travelled for cake sites was {cake_distance} under target")

    message = {"Load_message" : loads, "Distance_message" : distance}
        
    return message
