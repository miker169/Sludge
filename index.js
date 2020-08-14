const express = require('express')
let appInsights = require('applicationinsights');
appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
.setAutoDependencyCorrelation(true)
.setAutoCollectRequests(true)
.setAutoCollectPerformance(true, true)
.setAutoCollectExceptions(true)
.setAutoCollectDependencies(true)
.setAutoCollectConsole(true, true)
.setUseDiskRetryCaching(true)
.setSendLiveMetrics(false)
.setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
.start();
const path = require('path');
const fileUpload = require('express-fileupload')
const cors = require('cors')
const {BlobServiceClient} = require("@azure/storage-blob");
require('dotenv').config()
const app = express();
const fetch = require('node-fetch');
const {ClientSecretCredential} = require('@azure/identity');
const {SecretClient} = require('@azure/keyvault-secrets');

let runModelLink = '';


app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/"
}));

app.use(cors());

app.use(express.json());

app.use(function (req, res, next) {
  res.setTimeout(900000, function () {

    console.log('Request has timed out.');
    res.status(408).send('Request has timed out');
  });
  next();
});

app.use(express.static(path.join(__dirname, 'build'), {
  etag: false,
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'no-cache')
  }
}));
app.get('/', function (req, res) {
  console.log('About to get url for the container')
  fetch(process.env.startContainer, {
    method: 'get',
    headers: {'Content-Type': 'application/json'},
  }).then(res => {
    console.log('it returned');
    console.log(JSON.stringify(res, null, 2))
    return res.json()
  }).then(res => {
    console.log('required json')
    console.log(JSON.stringify(res, null, 2))
  })
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/file-upload', async function (req, res) {

  console.log('in file upload')
  const connectionString = await getAzureSecret('conn-str');
  console.log(connectionString);
  const blobServiceClient = await BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient('inputs');
  const blockBlobClient = containerClient.getBlockBlobClient(req.files.file.name);
  const uploadBlobResponse = await blockBlobClient.uploadFile(req.files.file.tempFilePath)
  res.status(200).send(`${req.files.file.name} uploaded`)
});

app.post('/logging', (req, res) => {
  console.log('About to write error log')
  console.log(JSON.stringify(req.body, null, 2))
  console.log('A front end error occurred: ', JSON.stringify(req.body))
  res.status(200).send('ok')
});

app.post('/latest-output', async function (req, res) {
  const connectionString = await getAzureSecret('conn-str');
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

const getAzureSecret = async (secret_name) => {
  console.log('secret I have asked for ', secret_name);
  const clientId = process.env.clientId;
  console.log('client ID', clientId);
  const clientSecret = process.env.clientSecret;
  console.log('client secret id', clientSecret)
  const tenantId = process.env.tenantId;
  console.log('tenantIf', tenantId)

  const vault_url = process.env.kvUri;
  console.log('vault url', vault_url);
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
  const secret_client = new SecretClient(vault_url, credential);
  const secret = await secret_client.getSecret(secret_name);
  console.log('secret', secret);
  return secret.value;
}

const fetchRunModelUrl = async () => {
  console.log('About to get url for the container')
  fetch(process.env.StartContainer, {
    method: 'get',
    headers: {'Content-Type': 'application/json'},
  }).then(res => {
    console.log('it returned', JSON.stringify(res, null, 2))
    return res.json()
  }).then(res => {
    console.log('required json', JSON.stringify(res, null, 2))
    return res
  })
}

app.post('/run-model', async function (req, res) {
  req.setTimeout(900000)
  const params = req.body;

  console.log('Called by app')

  console.log('About to call run_model')
  fetch(process.env.StartContainer, {
    method: 'get',
    headers: {'Content-Type': 'application/json'},
  }).then(result => {
    console.log('it returned', JSON.stringify(result, null, 2))
    return result.json()
  }).then(result => {
    console.log('required json', JSON.stringify(res, null, 2))
    let runModelUrl = 'http://'+ result.ip + ':5000/run_model';
    console.log('About to call:  ', runModelUrl)
    fetch(runModelUrl, {
      method: 'post',
      body: JSON.stringify(params),
      headers: {'Content-Type': 'application/json'},
    }).then(result => {
      console.log('About to parse json in run-model response')
      console.log(JSON.stringify(res, null, 2))
      return result.json()
    })
    .then(json => {
      console.log('Returning back to caller')
      console.log(JSON.stringify(json, null, 2))
      res.send(json);
    })
    .catch(err => {
      console.log('we have an error in run-model', err.message)
      console.log(JSON.stringify(err, null, 2))
      res.send(err)
    })
  })

})
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT);
server.setTimeout(900000)
