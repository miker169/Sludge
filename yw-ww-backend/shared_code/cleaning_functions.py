import numpy as np
import pandas as pd


def calculate_standard_site_fees(cost_df, cost_type):
    
    fee_df = cost_df.copy()
    
    data_cols = ["Indigenous", "Unthickened", "Thickened", "Cake"]
    df_cols = ["Site", "ID", "ST", "Rank"] + data_cols
    
    if cost_type == "Chemical":
        for i in data_cols:
            fee_df[i] = fee_df[i] * fee_df["Cost"] * fee_df["Dose"]
        
    elif cost_type == "Electrical":
        for i in data_cols:
            fee_df[i] = fee_df[i] * fee_df["Cost"] * fee_df["Consumption"]
        
    elif cost_type == "Temp":
        for i in data_cols:
            fee_df[i] = fee_df[i] * fee_df["Cost"]
        
    elif cost_type == "Liquor":
        for i in data_cols:
            fee_df[i] = fee_df[i] * fee_df["Cost"]

    else:
        fee_df = pd.DataFrame()

    if len(fee_df) > 0:

        fee_df = fee_df.loc[:, df_cols]
        fee_df = (fee_df.groupby(["Site", "ID", "ST", "Rank"], as_index = False)
                .agg({"Indigenous":"sum", "Unthickened":"sum", 
                    "Thickened":"sum", "Cake":"sum"}))

    return fee_df


def calculate_gate_fees(chemical_df, elec_use_df, temp_df, liquor_df):
    
    chem_costs = calculate_standard_site_fees(chemical_df, "Chemical")
    elec_costs = calculate_standard_site_fees(elec_use_df, "Electrical")
    temp_costs = calculate_standard_site_fees(temp_df, "Temp")
    liquor_costs = calculate_standard_site_fees(liquor_df, "Liquor")
    
    basic_gate_fee = (pd.concat([chem_costs, elec_costs, temp_costs, liquor_costs]))
    
    basic_gate_fee = (basic_gate_fee.groupby(["Site", "ID", "ST", "Rank"], as_index = False)
                     .agg({"Indigenous":"sum", "Unthickened":"sum", 
                         "Thickened":"sum", "Cake":"sum"})
                     .rename(columns ={"Unthickened":"STW", 
                         "Thickened":"THK", "Cake":"DW", "Site":"Site_To"}))
    
    basic_gate_fee = pd.melt(basic_gate_fee, id_vars = ["Site_To", "ID", "ST", "Rank"],
                            var_name = "ST_From",
                            value_name = "Cost")
    
    return basic_gate_fee


def calculate_electricity_gen_fees(elec_gen):
    
    elec_gen["Max_KWH"] = elec_gen["Availability"] * elec_gen["Capacity"] * elec_gen["Active_Hours"]
    elec_gen["£_KWH"] = elec_gen["RR"] * elec_gen["RV"] + elec_gen["EV"]
    elec_gen["Max_£_KWH"] = elec_gen["Max_KWH"] * elec_gen["£_KWH"]
    elec_gen["Gen_per_TDS"] = round(elec_gen["£_KWH"] * elec_gen["Kwh/TDS"], 2)
    elec_gen["Capacity"] = round(elec_gen["Max_£_KWH"] / elec_gen["Gen_per_TDS"], 2)
    
    elec_gen = (elec_gen.loc[:, ["Site", "ID", "ST", "Rank", "Gen_per_TDS", "Capacity"]]
               .fillna({"Capacity" : 0}))
    
    elec_gen["Gate_Fee"] = 0 - elec_gen["Gen_per_TDS"]
    
    return elec_gen


def calculate_recyling_fees(recycling):
    
    recycling = recycling.loc[recycling["Open"] != 0, :].copy()
    recycling["Capacity"] = recycling["Max"] * recycling["%Recycled"] * recycling["Open"] * (1 - recycling["%Destroyed"])
    recycling["Gate_Fee"] = (recycling["Cost"] / recycling["%Recycled"]) / (1 + recycling["%Destroyed"])
        
    recycling = recycling.loc[:, ["Site", "ID", "ST", "Rank", "Route", "Capacity", "Gate_Fee"]]
    
    return recycling


def create_cost_data(transport_costs, gate_fees, third_party):
    
    transport_costs = (pd.melt(transport_costs, id_vars=["Site", "ID", "ST", "Rank"], 
                              var_name='Site_To', 
                              value_name='Transport_Cost')
                      .rename(columns = {"ST" : "ST_From"}))
    
    transport_sites = (transport_costs.loc[:, ["Site", "ST_From"]]
                       .drop_duplicates()
                      .rename(columns = {"Site" : "Site_To", "ST_From" : "ST_To"}))

    transport_costs["Site_To"] = transport_costs["Site_To"].str[:2]
    
    transport_costs = (transport_costs.merge(transport_sites, on = "Site_To", how = "left"))
    transport_costs = transport_costs.loc[transport_costs["Transport_Cost"] > 0, :]
      
    cost_data = transport_costs.merge(gate_fees.loc[:, ["Site_To", "ST_From", "Cost"]], 
                             on = ["Site_To", "ST_From"], 
                             how = "left")
    
    cost_data = cost_data.merge(third_party.loc[:, ["Site", "TP_Cost"]], 
                             on = ["Site"], 
                             how = "left")
    
    cost_data["Cost"] = np.where(cost_data["ST_To"] == "TP", 
                                      cost_data["TP_Cost"],
                                      cost_data["Cost"])
    
    cost_data = cost_data.drop("TP_Cost", axis = 1)
    
    cost_data["Cost"] = round(cost_data["Cost"], 2)
    cost_data["Transport_Cost"] = round(cost_data["Transport_Cost"], 2)
    
    cost_data["Start-End"] = cost_data["Site"] + "-" + cost_data["Site_To"]
    
    return cost_data


def create_capacity_data(raw_df):
    
    cap_file = raw_df.loc[:, ["Name", "LC", "SC"]].copy()

    capacities = pd.melt(cap_file, id_vars=['Name'], var_name='Type', value_name='Capacity')
    capacities = capacities.loc[capacities["Capacity"] > 0]
    capacities["Type"] = np.where(capacities["Type"] == "LC", "LG", "SG")
    capacities["Cap-Node"] = capacities["Name"] + "-" + capacities["Type"]
    capacities = capacities.loc[:, ["Cap-Node", "Capacity"]]

    sink_capacities = (raw_df.loc[raw_df["Rank"] > 3, ["Name", "TI"]].copy()
                      .rename(columns = {"Name" : "Cap-Node", "TI" : "Capacity"}))

    tp_capacities = (raw_df.loc[raw_df["Rank"] == 3, ["Name"]].copy()
                      .rename(columns = {"Name" : "Cap-Node"}))

    tp_capacities.loc[:, "Capacity"] = 0

    capacities = pd.concat([capacities, sink_capacities, tp_capacities])
    
    return capacities


def create_variable_cost_capacity_data(elec_gen_df, recycling_df, capacity_df):
    
    elect_costs = elec_gen_df.loc[elec_gen_df["Gate_Fee"] != 0, ["Site", "ID", "ST", "Rank", "Capacity", "Gate_Fee"]].copy()
    elect_costs["Type"] = "Electricity_generation"
    elect_costs["Route"] = 1

    recyling_costs = recycling_df.loc[recycling_df["Gate_Fee"] != 0, ["Site", "ID", "ST", "Rank", "Route", "Capacity", "Gate_Fee"]].copy()
    recyling_costs["Type"] = "Recyling"
    
    capacities = capacity_df.rename(columns = {"Cap-Node" : "Site", "Capacity" : "Cap-Adjustment"})
    
    variable_costs = (pd.concat([elect_costs, recyling_costs])
                     .merge(capacities, on = "Site", how = "left"))
    
    #set additional 50 capacity at 0 cost for elec generation
    
    elec_add_capacity = variable_costs.loc[variable_costs["Type"] == "Electricity_generation", :].copy()
    elec_add_capacity.loc[:, "Route"] = 2
    elec_add_capacity.loc[:, "Capacity"] = 50
    elec_add_capacity.loc[:, "Gate_Fee"] = 0
    
    #join both dfs
    variable_costs = variable_costs.append(elec_add_capacity)

    #remove indigenous production from capacity values
    variable_costs["Capacity"] = np.where(variable_costs["Route"] == 1,
                                         variable_costs["Capacity"] - variable_costs["Cap-Adjustment"],
                                         variable_costs["Capacity"])
    
    # correct for production being greater than availability
    site_type_df = variable_costs.loc[variable_costs["Rank"] == 4, ["Site", "Type"]].copy().drop_duplicates()
    
    for _, j in site_type_df.iterrows():
        cap_data = variable_costs.loc[(variable_costs["Site"] == j["Site"]) & 
                                      (variable_costs["Type"] == j["Type"]), :].copy()
        
        route_1_cap = cap_data.loc[cap_data["Route"] == 1, "Capacity"].iloc[0]
        
        if route_1_cap < 0:
            route_1_abs = abs(route_1_cap)
            route_2_cap = variable_costs.loc[(variable_costs["Site"] == j["Site"]) & 
                               (variable_costs["Type"] == j["Type"]) &
                               (variable_costs["Route"] == 2), "Capacity"].iloc[0]
            
            route_2_cap_updated = route_2_cap - route_1_abs
            
            variable_costs.loc[(variable_costs["Site"] == j["Site"]) & 
                               (variable_costs["Type"] == j["Type"]) &
                               (variable_costs["Route"] == 1), "Capacity"] = 0
            
            variable_costs.loc[(variable_costs["Site"] == j["Site"]) & 
                               (variable_costs["Type"] == j["Type"]) &
                               (variable_costs["Route"] == 2), "Capacity"] = route_2_cap_updated
        else:
            continue
            
    # round fees and drop unneeded columns
    variable_costs.loc[:, "Gate_Fee"] = round(variable_costs["Gate_Fee"], 2)
    variable_costs = variable_costs.drop(["Route", "Cap-Adjustment"], axis = 1)

    return variable_costs


def calculate_indigenous_costs(gate_fees, variable_costs):
    
    ind_costs = gate_fees.loc[gate_fees["ST_From"] == "Indigenous", ["Site_To", "Cost"]].copy()

    elec_rec_fees = (variable_costs.groupby(["Site", "Type"], as_index = False)
                    .agg({"Gate_Fee" : "min"})
                    .groupby(["Site"], as_index = False)
                    .agg({"Gate_Fee" : "sum"})
                    .rename(columns = {"Site" : "Site_To"}))

    ind_costs = (ind_costs.merge(elec_rec_fees, on = "Site_To", how = "left")
                .fillna({"Gate_Fee": 0})
                .rename(columns = {"Site_To" : "Name"}))
    
    ind_costs["Ind_Cost"] = ind_costs["Cost"] + ind_costs["Gate_Fee"]
    
    ind_costs["Ind_Cost"] = round(ind_costs["Ind_Cost"], 2)
    
    ind_costs = ind_costs.drop(["Gate_Fee", "Cost"], axis = 1)
    
    return ind_costs

