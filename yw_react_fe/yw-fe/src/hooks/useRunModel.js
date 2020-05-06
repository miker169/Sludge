import axios from "axios";
import {BlobServiceClient} from "@azure/storage-blob";
import {SAVE_MESSAGES} from "../context/FlowContext";
const REACT_APP_BLOB_SAS=process.env.REACT_APP_BLOB_SAS;
const outputContainer = "data-outputs";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

export default async (dispatch) => {

  const response = await axios.get(process.env.REACT_APP_RUN_MODEL_URL, {
    headers: {'Access-Control-Allow-Origin': '*'}
  });

  dispatch({type: SAVE_MESSAGES, payload: response.data.data})
  const blobServiceClient = new BlobServiceClient(REACT_APP_BLOB_SAS);
  const containerClient = blobServiceClient.getContainerClient(outputContainer);
  const blockBlobClient = containerClient.getBlobClient("pp_test.csv");
  const blobResponse = await blockBlobClient.download()
  const body = await blobResponse.blobBody;
  const blob =  await body.text();
  return blob;
}
