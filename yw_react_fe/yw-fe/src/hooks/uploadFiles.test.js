import uploadFiles from "./uploadFiles";
import {BlobServiceClient} from "@azure/storage-blob";
jest.mock("@azure/storage-blob")

describe('UploadFiles', () => {
  let res = {
    statusCode: 200
  }

  let getContainerClientMock = jest.fn();
  let getBlockBlobClientMock = jest.fn();
  let uploadBrowserDataMock =jest.fn();
  const inputContainer = "inputs";

  beforeEach(() => {
    jest.clearAllMocks();
   uploadBrowserDataMock.mockImplementation(() => Promise.resolve(res));

   getBlockBlobClientMock.mockImplementation(() => ({
      uploadBrowserData: uploadBrowserDataMock
    }));

    getContainerClientMock.mockImplementation((value) => ({
        getBlockBlobClient: getBlockBlobClientMock
    }))
    const constructResponse = {
      getContainerClient: getContainerClientMock
    }
    BlobServiceClient.mockImplementation(() => constructResponse);
  })

  test('calls getContainer Client', () => {
    uploadFiles([{file: 'test'}])
    expect(getContainerClientMock).toHaveBeenCalledWith(inputContainer);
  });

  test('calls getBlockBlobClient', () => {
    let testFile = {file: 'test', name: 'test1'}
    uploadFiles([testFile])
    expect(getBlockBlobClientMock).toHaveBeenCalledWith(testFile.name);
  });

  test('calls uploadBrowserDataMock', () => {
    let testFile = {file: 'test', name: 'test1'}
    uploadFiles([testFile])
    expect(uploadBrowserDataMock).toHaveBeenCalledWith(testFile);
  });

  test('returns a response back from uploadFiles when successful', async () => {
    let testFile = {file: 'test', name: 'test1'}
    let res = await uploadFiles([testFile]);
    expect(res[0].statusCode).toBe(200);
  })

})
