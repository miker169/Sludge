import Papa from 'papaparse';
import React from 'react';
import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import axios from 'axios';

import XLSX from 'xlsx';
import {BlobServiceClient} from "@azure/storage-blob";

import productionSchema from '../schemas/productionFileSchema';

import chemicalSchema from '../schemas/chemicalSchema';
import distanceSchema from '../schemas/DistanceSchema';
import electricityGenerationSchema from '../schemas/electricityGenerationSchema';
import TransportCostSchema from '../schemas/TransportCostSchema';
import electricityUseSchema from '../schemas/electricityUseSchema';
import recyclingSchena from '../schemas/recyclingSchema';
import tempShema from '../schemas/tempSchema';
import liquorsSchema from '../schemas/liquorsSchema';
import thirdPartySchema from '../schemas/ThirdPartySchema';
import volumeSchema from "../schemas/volumeSchema";
import {HelpContext} from "../context/HelpContext";

const REACT_APP_BLOB_SAS = process.env.REACT_APP_BLOB_SAS;
const inputContainer = "inputs";

export default (setFiles, setPayload, payload, files) => {
  const {setErrorText} = React.useContext(HelpContext);

  const parseExcelFile = async file => {
    setErrorText([]);


    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, {type: 'binary'});
      let jsonData = {};
      for (let i = 0; i < wb.SheetNames.length; i++) {
        if (wb.SheetNames[i] === 'Distance' || wb.SheetNames[i] === 'Transport-cost') {
          continue
        }
        jsonData[wb.SheetNames[i]] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[i]]);
      }
      setPayload({...payload, referenceInput: jsonData});

    }
    reader.readAsBinaryString(file)
    // readXlsxFile(file, { getSheets: true }).then(sheets => {
    //   let i = 0;
    //   let items = sheets.map(async obj => {
    //     i++;
    //     const schema = getSchema(obj.name);
    //     let item = await readXlsxFile(file, { sheet: i, schema });
    //     if (item.errors.length > 0) {
    //         xlErrs = [...xlErrs, ...buildHumanExcelErrors(item.errors, obj.name, item.rows)]
    //         //setErrorText(prevState => [...prevState, buildHumanExcelErrors(item.errors, obj.name)]);
    //     }else {
    //       return {
    //         [obj.name]: item.rows,
    //       };
    //     }
    //   });
    //
    //   Promise.all(items).then(data => {
    //     let refData = data.reduce((acc, item) => {
    //       if(item === undefined) return acc;
    //
    //       let key = Object.keys(item)[0];
    //       acc[key] = item[key];
    //       return acc;
    //     }, {});
    //     if (xlErrs.length === 0) {
    //       setPayload({...payload, referenceInput: refData});
    //     }else{
    //       setErrorText(prevErrors => [...prevErrors, ...xlErrs])
    //     }
    //   });
    // });
  };

  // const buildSasToken = () => {
  //   const accountName = 'ywwwdatastoredev'
  // }

  const parseCsvFile = file => {
    setErrorText([]);
    Papa.parse(file, {
      complete: ({data, errors}) => {
        if (!errors.length) {
          let ajv = new Ajv({allErrors: true, jsonPointers: true});
          ajvErrors(ajv);
          let validate = ajv.compile(productionSchema);
          validate(data);
          if (validate?.errors?.length) {
            setErrorText(prevErrorText => buildHumanErrors(validate.errors));
          } else {
            setPayload({...payload, productionInput: data});
          }
        } else {
          setErrorText(errors);
        }
      },
      delimiter: ',',
      skipEmptyLines: true,
      delimitersToGuess: [','],
      header: true,
      dynamicTyping: true,
      transformHeader: parseValueCallback,
    });
  };

  const convertFileToJson = async loadedFile => {

    let token = await axios.get(process.env.REACT_APP_SAS_GENERATOR);
    debugger;
    debugger;
    const blobServiceClient = new BlobServiceClient(`https://ywwwdatastoredev.blob.core.windows.net`, token.data.sas_key);
    const containerClient = blobServiceClient.getContainerClient(inputContainer);
    try {
      const promises = [];
      const blockBlobClient = containerClient.getBlockBlobClient(loadedFile[0].name);
      promises.push(blockBlobClient.uploadBrowserData(loadedFile[0]));
      // const blockBlobClient = containerClient.getBlockBlobClient(loadedFile[0].name);
      // promises.push(blockBlobClient.uploadBrowserData(loadedFile));
      let a = await Promise.all(promises);
      debugger;
      return a;
    } catch (err) {
      return err
    }
  };

  const parseValueCallback = header => {
    if (header === 'Full Name') return 'FullName';
    return header;
  };

  const buildHumanErrors = (errors) => {
    let readableErrors = [];
    errors.forEach(function (error) {
      if (error.params.missingProperty && !readableErrors.includes(`${error.params.missingProperty} is a required field`)) {
        let errorString = `${error.params.missingProperty} is a required field`;
        readableErrors.push(errorString);
      } else if (readableErrors.includes(`${error.params.missingProperty} is a required field`)) {
        return
      } else {
        // eslint-disable-next-line
        let [_, row, type] = error.dataPath.split('/');
        readableErrors.push(`${type} ${error.message} on row  ${parseInt(row) + 1}`);
      }

    });

    return readableErrors;
  }

  const buildHumanExcelErrors = (errors, worksheet, rows) => {

    let sortedByColumn = {}
    let readableErrors = []

    for (let i = 0; i < errors.length; i++) {
      // if the object exists
      if (!!sortedByColumn[errors[i]?.column]) {
        sortedByColumn[errors[i]?.column].push(errors[i]);
      } else {
        sortedByColumn[errors[i]?.column] = [errors[i]]
      }
    }

    for (let columnError in sortedByColumn) {
      //loop through each column
      if (sortedByColumn[columnError].length >= rows.length) {
        // get the first
        readableErrors.push(`Header is missing for ${sortedByColumn[columnError][0].column} in worksheet ${worksheet}`)
      } else {
        let errorList = sortedByColumn[columnError]
        for (let err of errorList) {
          readableErrors.push(`${err.column} is ${err.error} in worksheet ${worksheet} on row ${err.row + 1}`);
        }
      }
    }
    return readableErrors;
  }

  const getSchema = name => {
    switch (name) {
      case 'Volumes':
        return volumeSchema;
      case 'Chemicals':
        return chemicalSchema;
      case 'Distance':
        return distanceSchema;
      case 'Electricity-generation':
        return electricityGenerationSchema;
      case 'Transport-cost':
        return TransportCostSchema;
      case 'Electricity-use':
        return electricityUseSchema;
      case 'Recycling':
        return recyclingSchena;
      case 'Temp':
        return tempShema;
      case 'Liquors':
        return liquorsSchema;
      case 'Third-party':
        return thirdPartySchema;
      default:
        return undefined;
    }
  };

  return {convertFileToJson};
};
