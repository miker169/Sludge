import Papa from 'papaparse';
import React from 'react';
import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';

import productionSchema from '../schemas/productionFileSchema';

import readXlsxFile from 'read-excel-file';
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

export default (setFiles, setPayload, payload) => {
  const { setErrorText, errorText } = React.useContext(HelpContext);

  const parseExcelFile = file => {
    setErrorText([]);
    readXlsxFile(file, { getSheets: true }).then(sheets => {
      let i = 0;
      let items = sheets.map(async obj => {
        i++;
        const schema = getSchema(obj.name);
        let item = await readXlsxFile(file, { sheet: i, schema });
        if (item.errors.length > 0) {
            setErrorText(prevState => [...prevState, buildHumanExcelErrors(item.errors, obj.name)]);
        }else {
          return {
            [obj.name]: item.rows,
          };
        }
      });

      Promise.all(items).then(data => {
        let refData = data.reduce((acc, item) => {
          if(item === undefined) return acc;

          let key = Object.keys(item)[0];
          acc[key] = item[key];
          return acc;
        }, {});
        if (errorText.length === 0) {
          setPayload({...payload, referenceInput: refData});
        }
      });
    });
  };

  const parseCsvFile = file => {
    setErrorText([]);
    Papa.parse(file, {
      complete: ({ data, errors }) => {
        if (!errors.length) {
          let ajv = new Ajv({allErrors: true, jsonPointers: true});
          ajvErrors(ajv);
          let validate = ajv.compile(productionSchema);
          validate(data);
          if (validate?.errors?.length) {
            setErrorText(prevErrorText =>  buildHumanErrors(validate.errors));
          } else {
            setPayload({ ...payload, productionInput: data });
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
    let file = loadedFile[0];
    let fileType = file.name.split('.').pop();
    setFiles(file.name);

    if (fileType === 'csv') {
      parseCsvFile(file, setPayload, payload);
    } else if (fileType === 'xlsx') {
      parseExcelFile(file, setPayload, payload);
    }
  };

  const parseValueCallback = header => {
    if (header === 'Full Name') return 'FullName';
    return header;
  };

  const  buildHumanErrors = (errors) => {
    let readableErrors = [];
      errors.forEach(function(error) {

      if (error.params.missingProperty && !readableErrors.includes(`${error.params.missingProperty} is a required field`)) {
        let errorString = `${error.params.missingProperty} is a required field`;
        readableErrors.push(errorString);
      } else if(readableErrors.includes(`${error.params.missingProperty} is a required field`)){
        return
      }
      readableErrors.push(error.message);
    });

   return readableErrors;
  }

  const buildHumanExcelErrors = (errors, worksheet) =>{
    let readableErrors = []
    errors.forEach((error) => {
      if(readableErrors.includes(`${error.column} is ${error.error} in worksheet ${worksheet}`)){
        return;
      }else{
        readableErrors.push (`${error.column} is ${error.error} in worksheet ${worksheet}`);
        return;
      }
    });
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

  return { convertFileToJson };
};
