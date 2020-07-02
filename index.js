const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const axios = require('axios');
const moment = require('moment')
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

app.post('/latest-output', async function(req, res){
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


app.post('/run-model', async function(req, res) {
  const params = req.body;

  try {
    axios.post('http://127.0.0.1:5000/run_model', req.body)
    .then((response) => {
      res.send(response.data)
    })
    .catch(err => {
    })
  }catch(err)  {
    console.log(err)
  }
})
const PORT = process.env.PORT || 8080;
app.listen(PORT);
