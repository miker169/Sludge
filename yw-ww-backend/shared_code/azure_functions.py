from azure.storage.blob import BlobServiceClient, ContentSettings
from io import BytesIO
from datetime import datetime, date, timedelta
import pandas as pd
import numpy as np
import xlrd

# Blob helpers

def stream_blob_to_df(connect_str, container, file, filetype):

    blob_service_client = BlobServiceClient.from_connection_string(connect_str)
    blob_download_client = blob_service_client.get_blob_client(container=container, blob=file)

    if filetype == "CSV":
        df = pd.read_csv(BytesIO(blob_download_client.download_blob(connection_timeout=90).readall()))
    
    else:
        df = pd.read_excel(BytesIO(blob_download_client.download_blob(connection_timeout=90).readall()), sheet_name=None)
        
    return df


def stream_df_to_blob(connect_str, container, blob, df):

    blob_service_client = BlobServiceClient.from_connection_string(connect_str)
    blob_upload_client = blob_service_client.get_blob_client(container=container, blob=blob)
    csv_settings = ContentSettings(content_type='application/vnd.ms-excel')
    blob_upload_client.upload_blob(df.to_csv(index = False), connection_timeout=90, overwrite=True, content_settings=csv_settings)



