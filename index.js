const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const fileUpload = require('express-fileupload')
const cors = require('cors')
const { BlobServiceClient } = require("@azure/storage-blob");
require('dotenv').config()
const app = express();

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : "/tmp/"
}));

// app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/file-upload',async function(req, res) {
  const connectionString = process.env.DEV_DATASTORE_KEY;
  const blobServiceClient = await BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient('inputs');
  const blockBlobClient = containerClient.getBlockBlobClient(req.files.file.name);
  const uploadBlobResponse = await blockBlobClient.uploadFile(req.files.file.tempFilePath)
  res.status(200).send(`${req.files.file.name} uploaded`)
});

async function streamToString(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data.toString());
    });
    readableStream.on("end", () => {
      resolve(chunks.join(""));
    });
    readableStream.on("error", reject);
  });
}

app.post('/latest-output', async function(req, res){
  const connectionString = process.env.DEV_DATASTORE_KEY;
  const blobServiceClient = await BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient('outputs');
  const blockBlobClient = containerClient.getBlockBlobClient(req.body.filename);

  res.writeHead(200, {
    'Content-Disposition': `attachment; filename="${req.body.filename}"`,
    'Content-Type': 'application/vnd.ms-excel',
  });
  let buffer = await blockBlobClient.downloadToBuffer()
  res.end(buffer)
})



const PORT = process.env.PORT || 8080;
app.listen(PORT);
