import numpy as np
import pandas as pd


def create_distance_df(distance_raw):
    
    distances_long = pd.melt(distance_raw, id_vars=['Site', "ST", "Rank", "TDS", "%DS", "Max_Vol"], 
                             var_name='To', value_name='Distance')
    
    distances_long["To"] = distances_long["To"].str[:2]

    to_ranks = (distance_raw.loc[:, ["Site", "Rank"]]
               .copy()
               .rename(columns = {"Site" : "To", "Rank" : "Rank_To"}))
    
    to_types = (distance_raw.loc[:, ["Site", "ST"]]
           .copy()
           .rename(columns = {"Site" : "To", "ST" : "ST_To"}))

    distances_long = distances_long.merge(to_ranks, on = "To", how = "left")
    distances_long = distances_long.merge(to_types, on = "To", how = "left")
    
    distances_long = distances_long.loc[(distances_long["Distance"] > 0) & 
                                        (distances_long["Rank_To"] > distances_long["Rank"]), :]
    
    distances_long["TDS_Per_Trip"] = distances_long["%DS"] * distances_long["Max_Vol"]
    distances_long["Av_Loads"] = distances_long["TDS"] / distances_long["TDS_Per_Trip"]
    distances_long["Start-End"] = distances_long["Site"] + "-" + distances_long["To"]
    
    return distances_long


#create distance metric df 2 - round trip distances adjusted by loads, normalised by driver kms and TDS

def create_driver_load_adjusted_distance(distances_df, liquid_km, cake_km):
    
    driver_load_adjusted_distances = distances_df.copy()
    
    driver_load_adjusted_distances["LAD"] = np.where(driver_load_adjusted_distances["Av_Loads"] > 1,
                                                  driver_load_adjusted_distances["Distance"] * 2,
                                                  driver_load_adjusted_distances["Distance"])
    
    driver_load_adjusted_distances["LAD_Loads"] = driver_load_adjusted_distances["Av_Loads"] * driver_load_adjusted_distances["LAD"]
    
    driver_load_adjusted_distances["LAD_Loads_KM"] = np.where(driver_load_adjusted_distances["Rank"] < 3,
                                                  driver_load_adjusted_distances["LAD_Loads"] / liquid_km,
                                                  driver_load_adjusted_distances["LAD_Loads"] / cake_km)
    
    driver_load_adjusted_distances["LAD_Loads_KM_TDS"] = driver_load_adjusted_distances["LAD_Loads_KM"] / driver_load_adjusted_distances["TDS"]
    
    return driver_load_adjusted_distances

