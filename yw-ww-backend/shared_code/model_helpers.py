from azure.storage.blob import BlobServiceClient
from io import BytesIO
from datetime import datetime, date, timedelta
import networkx as nx
import pandas as pd
import numpy as np
import itertools

# Blob helpers

def stream_blob_to_df(connect_str, container, file):

    blob_service_client = BlobServiceClient.from_connection_string(connect_str)
    blob_download_client = blob_service_client.get_blob_client(container=container, blob=file)
    df = pd.read_csv(BytesIO(blob_download_client.download_blob(connection_timeout=90).readall()))

    return df


def stream_df_to_blob(connect_str, container, blob, df):

    blob_service_client = BlobServiceClient.from_connection_string(connect_str)
    blob_upload_client = blob_service_client.get_blob_client(container=container, blob=blob)
    blob_upload_client.upload_blob(df.to_csv(index = False), connection_timeout=90, overwrite=True)

    
# data-prep helpers

def third_party_calcs(raw_df):
    
    production = raw_df.loc[raw_df["Rank"] < 4, "P"].sum()
    
    capacity = raw_df.loc[raw_df["Rank"] == 4, "TI"].sum()
    
    if production > capacity:
        tp_demand = production - capacity
        adjusted_production = production - tp_demand
        return True, tp_demand, adjusted_production
    
    else:
        
        tp_demand = 0
        adjusted_production = production
        return False, tp_demand, adjusted_production

def build_transport_costs(tp_type, tp_demand, site_names, raw_df):

    if tp_type == "each-run":
        tp_cost = 250

    else:
        tp_cost = 250 / tp_demand
    piv_cols = ["Name"] + site_names
    pivot_file = raw_df.loc[:, piv_cols]
    transport_costs = pd.melt(pivot_file, id_vars=['Name'], var_name='Site', value_name='Cost').sort_values("Name")
    transport_costs["Site"] = transport_costs["Site"].str[:2]
    transport_costs["Start-End"] = transport_costs["Name"] + "-" + transport_costs["Site"]
    transport_costs["Cost"] = np.where(transport_costs["Site"] == "NW", 
                                    transport_costs["Cost"] + tp_cost, 
                                    transport_costs["Cost"])

    return transport_costs


def build_capacities(raw_df, tp_demand):

    cap_file = raw_df.loc[:, ["Name", "LC", "SC"]].copy()

    capacities = pd.melt(cap_file, id_vars=['Name'], var_name='Type', value_name='Capacity')
    capacities = capacities.loc[capacities["Capacity"] > 0]
    capacities["Type"] = np.where(capacities["Type"] == "LC", "LG", "SG")
    capacities["Cap-Node"] = capacities["Name"] + "-" + capacities["Type"]
    capacities = capacities.loc[:, ["Cap-Node", "Capacity"]]

    sink_capacities = (raw_df.loc[raw_df["Rank"] == 4, ["Name", "TI"]].copy()
                    .rename(columns = {"Name" : "Cap-Node", "TI" : "Capacity"}))

    tp_capacities = (raw_df.loc[raw_df["Rank"] == 3, ["Name"]].copy()
                    .rename(columns = {"Name" : "Cap-Node"}))

    tp_capacities.loc[:, "Capacity"] = tp_demand

    capacities = pd.concat([capacities, sink_capacities, tp_capacities])

    return capacities


def calculate_indigenous_costs(raw_df):

    ind_costs = raw_df.loc[raw_df["Rank"] != 5, ["Name", "P", "IC"]].copy()

    ind_costs.loc[:, "Ind_Cost"] = ind_costs["P"] * ind_costs["IC"]

    return ind_costs


def create_site_df(raw_df):
    
    all_sites = raw_df.loc[:, ["Name", "ID", "Rank"]].copy()

    for _, j in all_sites.iterrows():

        if j["Rank"] == 2 or j["Rank"] == 3:
            a = pd.DataFrame({"Name" : [j["Name"] + "-LG"],
                              "ID" : [j["ID"]],                          
                             "Rank" : [j["Rank"]]})
            all_sites = all_sites.append(a, ignore_index = True)

        elif j["Rank"] == 4:
            a = pd.DataFrame({"Name" : [j["Name"] + "-LG"],
                              "ID" : [j["ID"]],
                             "Rank" : j["Rank"]})

            b = pd.DataFrame({"Name" : [j["Name"] + "-SG"],
                              "ID" : [j["ID"]],
                             "Rank" : j["Rank"]})
            all_sites = all_sites.append(a, ignore_index = True)
            all_sites = all_sites.append(b, ignore_index = True)

    all_sites["Key"] = 0
    
    return all_sites 


def create_tp_dep_site_df(tp_req, raw_df):
    
    if tp_req == True:
        site_df = create_site_df(raw_df)
    
    else:
        non_tp_df = raw_df.loc[raw_df["Rank"] != 5, :]
        site_df = create_site_df(non_tp_df)
        
    return site_df


# node helpers

def create_node_tuples(site_df, raw_df, adjusted_production, tp_demand):

    node_df = site_df.copy()

    node_demand = raw_df.loc[:, ["Name", "Rank", "P", "TI"]].copy()
    node_demand["P"] = np.where(node_demand["Rank"] == 4, 0, node_demand["P"])
    node_demand["P"] = np.where(node_demand["Rank"] != 4, 0 - node_demand["P"], node_demand["P"])
    node_demand = node_demand.loc[:, ["Name", "P"]]

    node_df = (node_df.merge(node_demand, on = "Name", how = "left")
            .fillna({"P":0}))

    sink_df = pd.DataFrame({"Name" : "Sink",
            "P" : adjusted_production}, index=[0])

    node_df = node_df.loc[:, ["Name", "P"]]
    node_df.loc[node_df["Name"] == "NW", "P"] = tp_demand
    node_df = pd.concat([node_df, sink_df])

    node_tuples = [(i["Name"], {"demand" : i["P"]}) for _, i in node_df.iterrows()]

    return node_df, node_tuples

# edge helpers

def define_site_to_gate_edges(type, df, rank):
    
    if type == "liquid":
        
        start_sites = (df.loc[(df["Rank"] == rank) & (~df["Name"].str.contains("-LG|-SG")), ["Name", "Key"]]
                       .copy()
                      .rename(columns = {"Name" : "Start"}))

        gate_sites = (df.loc[(df["Rank"] > rank) & (df["Name"].str.contains("-LG")), ["Name", "Key"]]
                     .copy()
                    .rename(columns = {"Name" : "End"}))

        edges_df = (start_sites.merge(gate_sites, on = "Key")
                       .drop("Key", axis = 1))
        
    else:
        
        start_sites = (df.loc[(df["Rank"] == rank) & (~df["Name"].str.contains("-LG|-SG")), ["Name", "Key"]]
                       .copy()
                      .rename(columns = {"Name" : "Start"}))

        gate_sites = (df.loc[(df["Rank"] > rank) & (df["Name"].str.contains("-SG")), ["Name", "Key"]]
                     .copy()
                    .rename(columns = {"Name" : "End"}))

        edges_df = (start_sites.merge(gate_sites, on = "Key")
                       .drop("Key", axis = 1))
        
    return edges_df


def define_gate_to_site_edges(type, df, rank):
    
    if type == "liquid":
        
        end_sites = (df.loc[(df["Rank"] == rank) & (~df["Name"].str.contains("-LG|-SG")), ["Name", "ID"]]
                       .copy()
                      .rename(columns = {"Name" : "End"}))

        gate_sites = (df.loc[(df["Rank"] == rank) & (df["Name"].str.contains("-LG")), ["Name", "ID"]]
                     .copy()
                    .rename(columns = {"Name" : "Start"}))

        edges_df = (gate_sites.merge(end_sites, on = "ID")
                       .drop("ID", axis = 1))
        
    else:
        
        end_sites = (df.loc[(df["Rank"] == rank) & (~df["Name"].str.contains("-LG|-SG")), ["Name", "ID"]]
                       .copy()
                      .rename(columns = {"Name" : "End"}))

        gate_sites = (df.loc[(df["Rank"] == rank) & (df["Name"].str.contains("-SG")), ["Name", "ID"]]
                     .copy()
                    .rename(columns = {"Name" : "Start"}))

        edges_df = (gate_sites.merge(end_sites, on = "ID")
                       .drop("ID", axis = 1))
        
    return edges_df


def define_dw_to_tp_edges(df):
    
    start_sites = (df.loc[(df["Rank"] == 3) & (~df["Name"].str.contains("-LG|-SG")), ["Name", "Key"]]
                       .copy()
                      .rename(columns = {"Name" : "Start"}))
    
    end_sites = (df.loc[(df["Rank"] == 5), ["Name", "Key"]]
                       .copy()
                      .rename(columns = {"Name" : "End"}))
    
    edges_df = (start_sites.merge(end_sites, on = "Key")
                       .drop("Key", axis = 1))

    return edges_df


def create_sink_edges(df):
    

    sink_sites = (df.loc[(df["Rank"] == 4) & (~df["Name"].str.contains("-LG|-SG")), ["Name"]]
                   .copy()
                  .rename(columns = {"Name" : "Start"}))
    
    sink_sites.loc[:, "End"] = "Sink"
    
    return sink_sites


def create_edge_tuples(liquid_gate_edges, solid_gate_edges, gate_liquid_edges, gate_solid_edges, tp_edges, sink_edges, transport_costs, capacities):

    all_edges = pd.concat([liquid_gate_edges, solid_gate_edges, gate_liquid_edges, gate_solid_edges, tp_edges, sink_edges])
    all_edges["Start-End"] = all_edges["Start"].str[:2] + "-" + all_edges["End"].str[:2]
    all_edges["Cap-Node"] = np.where(all_edges["End"].str.contains("-"), all_edges["End"], all_edges["Start"])
    
    all_edges = all_edges.merge(transport_costs.loc[:, ["Start-End", "Cost"]], on = "Start-End", how = "left")

    all_edges = (all_edges.merge(capacities, on = "Cap-Node", how = "left")
                .fillna({"Cost":0}))

    all_edges = all_edges.loc[:, ["Start", "End", "Cost", "Capacity"]]

    edge_tuples = [(i["Start"], i["End"], {"capacity" : i["Capacity"],
                                        "weight" : round(i["Cost"])}) for _, i in all_edges.iterrows()]

    return edge_tuples


# graph helpers

def create_directed_graph(node_tuples, edge_tuples):

    G=nx.DiGraph()
    G.add_nodes_from(node_tuples)
    G.add_edges_from(edge_tuples)

    return G


def run_min_cost(G):

    flowCost, mincostFlow = nx.network_simplex(G)

    return flowCost, mincostFlow


# production plan helpers

def get_required_nodes(node_df):

    node_names = node_df.loc[~node_df["Name"].str.contains("-LG|-SG|Sink"), "Name"].tolist()
    multi_gate_nodes = node_df.loc[node_df["Name"].str.contains("-SG"), "Name"].tolist()
    multi_gate_nodes_list = [x[:2] + "-LG" for x in multi_gate_nodes] + [x[:2] + "-SG" for x in multi_gate_nodes]
    node_names = node_names + multi_gate_nodes_list

    return node_names

def create_flow_df(mincostFlow, node_names, site_df, indigenous_costs):

    flow_df = pd.DataFrame(mincostFlow).reset_index(drop = False).rename(columns = {"index" : "End"})
    flow_df = flow_df.loc[flow_df["End"] != "Sink", :]
    flow_df.loc[:, "End"] = flow_df["End"].str[:2]
    flow_df = flow_df.groupby("End", as_index = False).sum().set_index('End')

    flow_df_t = flow_df.transpose().reset_index(drop = False).rename(columns = {"index" : "Name"})
    flow_df_t = flow_df_t.loc[flow_df_t["Name"].isin(node_names)].reset_index(drop = True)
    flow_df_t = flow_df_t.merge(site_df, on = "Name", how = "left").merge(indigenous_costs, on = "Name", how = "left")

    flow_cols = flow_df_t.sort_values("Rank").loc[(flow_df_t["Rank"] > 1) & 
                                                (~flow_df_t["Name"].str.contains("-LG|-SG")), "Name"].tolist()

    flow_df_t = flow_df_t.loc[:, ["Name", "Rank", "P", "IC", "Ind_Cost"] + flow_cols]

    flow_df_t = flow_df_t.fillna({"P" : 0,
                                "IC" : 0,
                                "Ind_Cost" : 0})

    return flow_cols, flow_df_t


def get_flow_costs(flow_df, flow_cols, transport_costs):

    flow_costs = pd.melt(flow_df,  id_vars=['Name'], value_vars = flow_cols, var_name='End', value_name='Movement')
    flow_costs.loc[:, "Start-End"] = flow_costs["Name"] + "-" + flow_costs["End"]
    flow_costs = (flow_costs.merge(transport_costs.loc[:, ["Start-End", "Cost"]], on = "Start-End", how = "left")
                .fillna({"Cost" : 0}))

    flow_costs.loc[:, "Ext_Cost"] = flow_costs["Movement"] * round(flow_costs["Cost"])

    flow_costs_grouped = flow_costs.groupby("Name", as_index = False).agg({"Ext_Cost" : "sum"})

    return flow_costs_grouped


def create_production_plan(flow_df, flow_costs):

    flow_cost_df = flow_df.merge(flow_costs, on = "Name", how = "left")
    flow_cost_df.loc[:, "Ind_Cost"] = round(flow_cost_df["Ind_Cost"])
    flow_cost_df.loc[:, "Final_Cost"] = flow_cost_df["Ind_Cost"] + flow_cost_df["Ext_Cost"]

    return flow_cost_df


