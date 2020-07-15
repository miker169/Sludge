const express = require('express')
const path = require('path');
const fileUpload = require('express-fileupload')
const cors = require('cors')
const { BlobServiceClient } = require("@azure/storage-blob");
require('dotenv').config()
const app = express();
const fetch = require('node-fetch');

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : "/tmp/"
}));

app.use(cors());

app.use(express.json());

app.use(function(req, res, next){
  res.setTimeout(900000, function(){
    console.log('Request has timed out.');
    res.send(408);
  });
  next();
});

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

app.post('/run-model', function(req, res) {
  req.setTimeout(900000)
  const params = req.body;
  console.log('Called by app')

    console.log('About to call run_model')
    console.log('Calling with' , JSON.stringify(req.body))
    const runModelUrl = process.env.RUN_MODEL
    fetch(runModelUrl, {
      method: 'post',
      body: JSON.stringify(req.body),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => {
      console.log(JSON.stringify(res, null, 2))
      return res.json()
    })
      .then(json => {
        console.log('Returning back to caller')
        console.log(JSON.stringify(json, null, 2))
        res.send(json);
      })
      .catch(err => {
        console.log(JSON.stringify(err, null, 2))
        res.send(err)
      })
})
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT);
server.setTimeout(900000)
