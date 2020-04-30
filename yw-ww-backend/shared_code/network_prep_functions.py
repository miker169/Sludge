import networkx as nx
import numpy as np
import pandas as pd


def create_site_df(raw_df):
    
    all_sites = raw_df.loc[:, ["Name", "ID", "Rank"]].copy()

    for _, j in all_sites.iterrows():

        if j["Rank"] == 2:

            a = pd.DataFrame({"Name" : [j["Name"] + "-LG"], "ID" : [j["ID"]], "Rank" : [j["Rank"]]})

            all_sites = all_sites.append(a, ignore_index = True)
            
        elif j["Rank"] == 3:
            
            {'col1': [1, 2], 'col2': [3, 4]}

            a = pd.DataFrame({"Name" : [j["Name"] + "-LG", j["Name"] + "-R3"], "ID" : [j["ID"], j["ID"]],
                               "Rank" : [j["Rank"], j["Rank"]]})

            all_sites = all_sites.append(a, ignore_index = True)

        elif j["Rank"] == 4:

            a = pd.DataFrame({"Name" : [j["Name"] + "-LG", j["Name"] + "-SG", j["Name"] + "-JG", j["Name"] + "-EG", j["Name"] + "-RG"], 
                               "ID" : [j["ID"], j["ID"], j["ID"], j["ID"], j["ID"]], 
                               "Rank" : [j["Rank"], j["Rank"], j["Rank"], j["Rank"], j["Rank"]]})

            all_sites = all_sites.append(a, ignore_index = True)
            
        elif j["Rank"] == 5:

            a = pd.DataFrame({"Name" : [j["Name"] + "-SG"], "ID" : [j["ID"]], "Rank" : [j["Rank"]]})

            all_sites = all_sites.append(a, ignore_index = True)
            
            
    all_sites["Key"] = 0
    
    return all_sites


def create_node_df(site_df, raw_df):

    node_df = site_df.copy()

    node_demand = raw_df.loc[:, ["Name", "Rank", "P", "TI"]].copy()
    total_demand = node_demand.loc[node_demand["Rank"] < 4, "P"].sum()

    node_demand["P"] = (np.where(node_demand["Rank"] > 3, 0, 0 - node_demand["P"]))
    node_demand = node_demand.loc[:, ["Name", "P"]]

    node_df = (node_df.merge(node_demand, on = "Name", how = "left")
              .fillna({"P":0}))

    sink_df = pd.DataFrame({"Name" : "Sink",
               "P" : total_demand}, index=[0])

    node_df = node_df.loc[:, ["Name", "P"]]
    node_df = pd.concat([node_df, sink_df])
    
    return node_df


def define_site_to_gate_edges(site_df):
    
    #get standard edges
    
    sg_edges = site_df.merge(site_df, on = "Key")

    sg_edges = (sg_edges.loc[(sg_edges["Rank_x"] < 4) &
                             (~sg_edges["Name_x"].str.contains("-LG|-SG|-JG|-EG|-RG|-R3")) & 
                            (sg_edges["Name_y"].str.contains("-LG|-SG|-JG|-EG|-RG|-R3")) , :])
    

    rank_1_2 = (sg_edges.loc[(sg_edges["Rank_x"] < 3) &
                           (sg_edges["Rank_y"] > sg_edges["Rank_x"]) &
                            (~sg_edges["Name_y"].str.contains("-SG|-JG|-EG|-RG|-R3")), ["Name_x", "Name_y"]]
           .copy()
          .rename(columns = {"Name_x": "From", "Name_y" : "To"}))
    
    rank_3 = (sg_edges.loc[(sg_edges["Rank_x"] == 3) &
                           (sg_edges["Rank_y"] > sg_edges["Rank_x"]) &
                            (~sg_edges["Name_y"].str.contains("-LG|-JG|-EG|-RG|-R3")), ["Name_x", "Name_y"]]
           .copy()
          .rename(columns = {"Name_x": "From", "Name_y" : "To"}))
        
    
    tp = (sg_edges.loc[(sg_edges["Rank_x"] == 3) &
                       (sg_edges["Rank_y"] > sg_edges["Rank_x"]) &
                       (sg_edges["Rank_y"] == 5), ["Name_x", "Name_y"]]
          .copy()
          .rename(columns = {"Name_x": "From", "Name_y" : "To"}))
    
    route_three = (sg_edges.loc[(sg_edges["Rank_x"] == 3) &
                                (sg_edges["ID_x"] == sg_edges["ID_y"]) &
                             (sg_edges["Name_y"].str.contains("-R3")), ["Name_x", "Name_y"]]
                   .copy()
                  .rename(columns = {"Name_x": "From", "Name_y" : "To"}))
    
    #combine dfs
    
    all_edges = pd.concat([rank_1_2, rank_3, tp, route_three])
    
    return all_edges


def define_gate_to_site_edges(site_df):
    
    ls_gates = site_df.loc[(site_df["Rank"].isin([2, 3, 5]))
                        & (site_df["Name"].str.contains("-LG|-SG|-RG")), :].copy()
    
    rec_gates = site_df.loc[(site_df["Rank"] == 4)
                        & (site_df["Name"].str.contains("-RG")), :].copy()
    
    gates = pd.concat([ls_gates, rec_gates])
    
    sites = site_df.loc[(site_df["Rank"].isin([2, 3, 4, 5])) 
                        & (~site_df["Name"].str.contains("-LG|-SG|-JG|-EG|-RG|-R3")), :].copy()
    
    gs_edges = gates.merge(sites, on = "ID", how = "left")
    
    gs_edges = (gs_edges.loc[:, ["Name_x", "Name_y"]]
                .rename(columns = {"Name_x": "From", "Name_y" : "To"}))
    
    return gs_edges


def define_gate_to_gate_edges(site_df):
    
    gate_df = site_df.loc[site_df["Rank"] == 4, :].copy()
    
    liquid_solid_gates = gate_df.loc[gate_df["Name"].str.contains("-LG|-SG"), ["Name", "ID"]].copy()
    join_gates = gate_df.loc[gate_df["Name"].str.contains("-JG"), ["Name", "ID"]].copy()
    electricity_gates = gate_df.loc[gate_df["Name"].str.contains("-EG"), ["Name", "ID"]].copy()
    recyling_gates = gate_df.loc[gate_df["Name"].str.contains("-RG"), ["Name", "ID"]].copy()
    
    ls_to_join = (liquid_solid_gates.merge(join_gates, on = "ID", how = "left")
                 .rename(columns = {"Name_x": "From", "Name_y" : "To"})
                 .loc[:, ["From", "To"]])
    
    join_to_elec = (join_gates.merge(electricity_gates, on = "ID", how = "left")
                 .rename(columns = {"Name_x": "From", "Name_y" : "To"})
                 .loc[:, ["From", "To"]])
    
    elec_to_recyling = (electricity_gates.merge(recyling_gates, on = "ID", how = "left")
                 .rename(columns = {"Name_x": "From", "Name_y" : "To"})
                 .loc[:, ["From", "To"]])
    
    g_to_g_edges = pd.concat([ls_to_join, join_to_elec, elec_to_recyling])
    
    return g_to_g_edges    


def define_site_to_sink_edges(site_df):
    
    site_to_sink = site_df.loc[(site_df["Rank"] > 3) &
                               (~site_df["Name"].str.contains("-LG|-SG|-JG|-EG|-RG|-R3")), ["Name"]].copy()
    site_to_sink["To"] = "Sink"
    site_to_sink = site_to_sink.rename(columns = {"Name":"From"})
    
    return site_to_sink


def create_edges_df(site_df):
    
    #create edge dfs and concatenate
    
    s_g_edges = define_site_to_gate_edges(site_df)
    g_s_edges = define_gate_to_site_edges(site_df)
    g_g_edges = define_gate_to_gate_edges(site_df)
    s_t_edges = define_site_to_sink_edges(site_df)
    
    all_edges = pd.concat([s_g_edges, g_s_edges, g_g_edges, s_t_edges])
    
    all_edges["Start-End"] = np.where((all_edges["From"].str.contains("-")) & (all_edges["To"].str.contains("-")),
                                  all_edges["To"],
                                  np.where((all_edges["From"].str.contains("-")) & (~all_edges["To"].str.contains("-")),
                                 all_edges["From"].str[:2] + "-" + all_edges["To"],
                                np.where(all_edges["To"] == "Sink",
                                 all_edges["From"],
                                all_edges["From"] + "-" + all_edges["To"].str[:2])))

    return all_edges


def add_standard_costs_and_caps(edges_df, cost_df, capacity_df):
    
    # add in standard costings and capacities
    
    edges_df["Cap-Node"] = np.where(edges_df["To"].str.contains("-EG"),
                                   edges_df["To"].str[:2], 
                                    np.where(~edges_df["To"].str.contains("-LG|-SG"),
                                   edges_df["From"], edges_df["To"]))
    
    standard_cc = (edges_df.merge(cost_df.loc[:, ["Start-End", "Transport_Cost", "Cost"]], on = "Start-End", how = "left")
                   .merge(capacity_df, on = "Cap-Node", how = "left")
                 .fillna({"Cost" : 0, "Transport_Cost" : 0, "Capacity" : 0})
                  .drop("Cap-Node", axis = 1))
    
    return standard_cc


def add_variable_costs_and_caps(edges_df, var_cost_df):
     
    # add in capacity based costings
    
    er_costs =  var_cost_df.loc[var_cost_df["ST"] == "STF", ["Site", "Gate_Fee", "Type", "Capacity"]].copy()
    er_costs["To"] = np.where(er_costs["Type"] == "Electricity_generation",
                               er_costs["Site"] + "-RG",
                                er_costs["Site"])
    
    er_costs = er_costs.drop("Type", axis = 1)
    
    r3_costs = var_cost_df.loc[var_cost_df["ST"] == "DW", ["Site", "Gate_Fee", "Capacity"]].copy()
    r3_costs["To"] = r3_costs["Site"] + "-R3"
        
    cap_costs = (pd.concat([er_costs, r3_costs])
                .rename(columns = {"Capacity" : "Var_Capacity"}))
    
    variable_cc = (edges_df.merge(cap_costs, on = "To", how ="left")
                   .fillna({"Gate_Fee" : 0, "Var_Capacity" : 0}))
    
    variable_cc["Cost"] = variable_cc["Cost"] + variable_cc["Gate_Fee"]
    variable_cc["Capacity"] = variable_cc["Capacity"] + variable_cc["Var_Capacity"]
    
    variable_cc = variable_cc.drop(["Gate_Fee", "Site", "Var_Capacity"], axis = 1)   
    
    return variable_cc


def create_multi_network(node_tuples, edge_tuples):
    
    G=nx.MultiDiGraph()
    G.add_nodes_from(node_tuples)
    G.add_edges_from(edge_tuples)
    
    return G

