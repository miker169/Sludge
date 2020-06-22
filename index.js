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

app.use(cors());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.get('/ping', function (req, res) {
  return res.send('pong');
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.post('/file-upload',async function(req, res) {
  const connectionString = process.env.DEV_DATASTORE_KEY;
  const blobServiceClient = await BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient('inputs');
  const blockBlobClient = containerClient.getBlockBlobClient(req.files.file.name);
  const uploadBlobResponse = await blockBlobClient.uploadFile(req.files.file.tempFilePath)
  res.status(200).send(`${req.files.file.name} uploaded`)
});

const PORT = process.env.PORT || 8080;
app.listen(PORT);
