import { isValidFileName, getFileName, convertFileToJson } from './FileContext'

describe('FileContext', () => {


  describe('isValidFileName', () => {


    test.skip('Returns false given an in invalid File Name', () => {
      const file = new File(["Param,Value\nliquid_km,990\ncake_km,225"], "ssludgeParams.csv");
      expect(isValidFileName(file).isValid).toBeFalsy();
    });

    test('Returns true when given an valid File Name', () => {
      const file = new File(["Param,Value\nliquid_km,990\ncake_km,225"], "sludge-params.csv");
      expect(isValidFileName(file).isValid).toBeTruthy();
    });

    test.skip('returns the file type if valid', () => {
      const file = new File(["Param,Value\nliquid_km,990\ncake_km,225"], "sludgeParams.csv");
      expect(getFileName(file).type).toBe("SLUDGE_PARAMS");
    })
  });


  describe('convertsFileToJson', () => {

    test.skip('it returns a json response',  async () => {
      const testDispatch = jest.fn();
      //const blob = new Blob(["Param,Value\nliquid_km,990\ncake_km,225"], {type: 'text/csv'});
      let file = new File(["Param,Value\nliquid_km,990\ncake_km,225"], 'sludge-params.csv',{type: 'text/csv',});
      let expectedRes = {}
      const res = await convertFileToJson(testDispatch)(file);
      expect(res).toBe(expectedRes);
    });
  });

});
