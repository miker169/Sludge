import moxios from 'moxios';
import useRunModel from "./useRunModel";
import {SAVE_MESSAGES} from "../context/FlowContext";
import {BlobServiceClient} from "@azure/storage-blob";
jest.mock("@azure/storage-blob")
const outputContainer = "outputs";

describe.skip('runData', () => {
  let getContainerClientMock = jest.fn();
  let getBlobClientMock = jest.fn();
  let downloadMock =jest.fn();
  let mockDispatch = jest.fn();
  let testBlob;

  beforeEach(() => {
    process.env = Object.assign(process.env, { REACT_APP_RUN_MODEL_URL: 'http://localhost:3001' });
    jest.clearAllMocks();
    moxios.install();
    testBlob = new Blob([{file: 'test'}], {type: "text/csv"})
    const textResponse = jest.fn();

    textResponse.text = () => Promise.resolve(testBlob);

    const blobResponse = jest.fn();
    Object.defineProperty(blobResponse, 'blobBody', {
      get: jest.fn(() => Promise.resolve(textResponse)),
      set: jest.fn()
    })

    downloadMock.mockImplementation(() => blobResponse);
    getBlobClientMock.mockImplementation(() => ({
      download: downloadMock
    }));
    getContainerClientMock.mockImplementation((value) => ({
      getBlobClient: getBlobClientMock
    }))
    const constructResponse = {
      getContainerClient: getContainerClientMock
    }
    BlobServiceClient.mockImplementation(() => constructResponse);

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {warnings: 'test'}
      })
    });
  });
  afterEach(() => {
    moxios.uninstall();
  });

  test.skip('It returns some data from api', async () => {
    await useRunModel(mockDispatch);
    expect(mockDispatch).toHaveBeenCalledWith({type: SAVE_MESSAGES, payload: {warnings: 'test'}});
  });

  test.skip('it calls Blob Service Client', async () => {
    await useRunModel(mockDispatch);
    expect(getContainerClientMock).toHaveBeenCalledWith(outputContainer);
  });

  test.skip('it calls getBlobClientMock with the blob file we want', async () => {
    await useRunModel(mockDispatch);
    expect(getBlobClientMock).toHaveBeenCalledWith("pp_test.csv");
  });

  test.skip('it calls download mock which returns a Blob Respnse', async () => {
    await useRunModel(mockDispatch);
    expect(downloadMock).toHaveBeenCalled();
  });

  test.skip('it returns a blob', async () => {
    let blob = await useRunModel(mockDispatch);
    expect(blob.type).toBe(testBlob.type);
  })
})
