const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const fileUpload = require('express-fileupload')
const cors = require('cors')
const storage = require("@azure/storage-blob");
require('dotenv').config()
const app = express();
const temp = require('tmp')
const crypto = require('crypto')

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : "/tmp/"
}));

// app.use(cors());

app.use(express.json());

app.get('/ping', function (req, res) {
  return res.send('pong');
});

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// app.use(function(err, req, res, next) {
//   // 'SyntaxError: Unexpected token n in JSON at position 0'
//   debugger;
//  =
//   next(err);
// });

app.post('/file-upload',async function(req, res) {
  const connectionString = process.env.DEV_DATASTORE_KEY;
  const blobServiceClient = await storage.BlobServiceClient.fromConnectionString(connectionString);
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
  debugger;
  const connectionString = process.env.DEV_DATASTORE_KEY;
  const blobServiceClient = await storage.BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient('outputs');
  const blockBlobClient = containerClient.getBlockBlobClient(req.body.filename);
  temp.dir(async  function _tempNameGenerated(err, path) {
    if (err) throw err;
    const downloadBlockBlobResponse = await blockBlobClient.downloadToFile(path + '/'+req.body.filename);
    debugger;
    console.log('Created temporary filename: ', path);
   // res.end(path)
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="${req.body.filename}"`,
      'Content-Type': "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    res.end(path);
  });


  // const fileToSend = await streamToString(downloadBlockBlobResponse.readableStreamBody);
  //

  // // const download = Buffer.from(fileToSend, 'base64');
  // res.end(fileToSend)
});

function getBlobServiceUrl() {
  debugger;
  const credentials = new storage.SharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT_NAME,
    process.env.AZURE_STORAGE_ACCOUNT_KEY
  );
  const pipeline = storage.StorageURL.newPipeline(credentials);
  const blobPrimaryURL = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/`;
  return new storage.ServiceURL(blobPrimaryURL, pipeline);
}

app.get('/get-token', async (req, res) => {
  // console.log(getBlobServiceUrl())
   const accountname = process.env.AZURE_STORAGE_ACCOUNT_NAME
    const key = process.env.AZURE_STORAGE_ACCOUNT_KEY;
  const signedpermissions = 'rwdlac';
  const signedservice = 'bfqt';
  const signedresourcetype = 'sco';

  const signedProtocol = 'https';
  const signedversion = '2019-10-10';
  const cerds = new storage.StorageSharedKeyCredential(accountname,key);
  const startDate = new Date();
  const expiryDate = new Date();
  const start = new Date(new Date().getTime() - (15 * 60 * 1000));
  const end = new Date(new Date().getTime() + (30 * 60 * 1000));
  debugger;
  const result = storage.generateAccountSASQueryParameters({
    expiresOn : expiryDate,
    permissions: storage.AccountSASPermissions.parse(signedpermissions),
    protocol: storage.SASProtocol.Https,
    resourceTypes: storage.AccountSASResourceTypes.parse(signedresourcetype).toString(),
    services: storage.AccountSASServices.parse(signedservice).toString(),
    startsOn: startDate,
    version:signedversion

  },cerds).toString();
  console.log(result);
  const sasTokenUrl =`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/?${result}`
  res.send(sasTokenUrl);

  // const start = new Date(new Date().getTime() - (15 * 60 * 1000));
  // const end = new Date(new Date().getTime() + (30 * 60 * 1000));
  // const signedpermissions = 'rwdlac';
  // const signedservice = 'b';
  // const signedresourcetype = 'sco';
  // const signedexpiry = end.toISOString().substring(0, end.toISOString().lastIndexOf('.')) + 'Z';
  // const signedProtocol = 'https';
  // const signedversion = '2018-03-28';
  //
  // const StringToSign =
  //   accountname + '\n' +
  //   signedpermissions + '\n' +
  //   signedservice + '\n' +
  //   signedresourcetype + '\n' +
  //   '\n' +
  //   signedexpiry + '\n' +
  //   '\n' +
  //   signedProtocol + '\n' +
  //   signedversion + '\n';
  //
  // let sig = crypto.createHmac('sha256', Buffer.from(key, 'base64')).update(StringToSign, 'utf8').digest('base64');
  //
  // let sasToken =
  //   `sv=${(signedversion)}&ss=${(signedservice)}&srt=${(signedresourcetype)}&sp=${(signedpermissions)}&se=${encodeURIComponent(signedexpiry)}&spr=${(signedProtocol)}&sig=${encodeURIComponent(sig)}`;
  // console.log(sasToken)
  // // var storageBlobEndpoint = "https://"+ accountname +".blob.core.windows.net"
  // // var container="blobcontainer";
  // // var blobName="CP4.png";
  // // var requestURL = storageBlobEndpoint + "/" + container + "/" + blobName +"?"+sasToken
  // console.log(decodeURI(sasToken))
  // res.send(sasToken)
})



const PORT = process.env.PORT || 8080;
app.listen(PORT);
