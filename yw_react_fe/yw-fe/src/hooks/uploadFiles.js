import {BlobServiceClient} from "@azure/storage-blob";

const REACT_APP_BLOB_SAS=process.env.REACT_APP_BLOB_SAS;
const inputContainer = "inputs";

export default async (files) => {

    const blobServiceClient = new BlobServiceClient(REACT_APP_BLOB_SAS);
    const containerClient = blobServiceClient.getContainerClient(inputContainer);
    try {
      const promises = [];
      [...files].forEach(file => {
        const blockBlobClient = containerClient.getBlockBlobClient(file.name);
        promises.push(blockBlobClient.uploadBrowserData(file));
      });
      return await Promise.all(promises);
    } catch(err){
      return err
    }
}
