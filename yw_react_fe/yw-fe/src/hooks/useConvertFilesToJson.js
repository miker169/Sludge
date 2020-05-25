import Papa from "papaparse";
import readXlsxFile from "read-excel-file";

export default (setFiles, setPayload, payload) => {

  const parseExcelFile = (file) => {
    readXlsxFile(file, { getSheets: true}).then(  (sheets) => {
      let i = 0;
      let items = sheets.map( async (obj) => {
        i++;
        const item = await readXlsxFile(file, {sheet: i});

        return {
          [obj.name]: item
        }

      });
      Promise.all(items).then(data => {
        let retVal = {};
        for(let val of data){
          let key = Object.keys(val)[0];
          retVal = {...retVal, ...{[key]: val[key]}}
        }
        setPayload({...payload, referenceInput: retVal});
      });
    });
  }

  const parseCsvFile = (file) => {
    Papa.parse(file, {
      complete: ({data}) => {
        setPayload({...payload, productionInput: data});
      },
      config: {
        delimiter: ",",
        skipEmptyLines: "greedy",
        newline: '\n',
        delimitersToGuess: [','],
        header: true
      }
    });
  }

  const convertFileToJson =  async (loadedFile ) => {
    debugger;
    let file = loadedFile[0];
    let fileType = file.name.split('.').pop();
    setFiles(file.name)

    if(fileType === 'csv'){
      parseCsvFile(file, setPayload, payload)
    }else if (fileType === 'xlsx') {
      parseExcelFile(file, setPayload, payload)
    }
  }

  return { convertFileToJson }
}
