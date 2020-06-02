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
  const { setErrorText } = React.useContext(HelpContext);

  const parseExcelFile = file => {
    setErrorText([]);
    let xlErrs = [];
    readXlsxFile(file, { getSheets: true }).then(sheets => {
      let i = 0;
      let items = sheets.map(async obj => {
        i++;
        const schema = getSchema(obj.name);
        let item = await readXlsxFile(file, { sheet: i, schema });
        if (item.errors.length > 0) {
            xlErrs = [...xlErrs, ...buildHumanExcelErrors(item.errors, obj.name, item.rows)]
            //setErrorText(prevState => [...prevState, buildHumanExcelErrors(item.errors, obj.name)]);
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
        if (xlErrs.length === 0) {
          setPayload({...payload, referenceInput: refData});
        }else{
          setErrorText(prevErrors => [...prevErrors, ...xlErrs])
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
      }else{
        // eslint-disable-next-line
        let [_, row, type] = error.dataPath.split('/');
        readableErrors.push(`${type} ${error.message} on row  ${parseInt(row) + 1}`);
      }

    });

   return readableErrors;
  }

  const buildHumanExcelErrors = (errors, worksheet, rows) =>{

    let sortedByColumn = {}
    let readableErrors = []

    for(let i = 0; i < errors.length; i ++){
      // if the object exists
      if(!!sortedByColumn[errors[i]?.column]){
        sortedByColumn[errors[i]?.column].push(errors[i]);
      }else {
        sortedByColumn[errors[i]?.column] = [errors[i]]
      }
    }

    for(let columnError in sortedByColumn){
      //loop through each column
      if(sortedByColumn[columnError].length >= rows.length){
        // get the first
        readableErrors.push(`Header is missing for ${sortedByColumn[columnError][0].column} in worksheet ${worksheet}`)
      }else{
        let errorList = sortedByColumn[columnError]
        for(let err of errorList){
          readableErrors.push (`${err.column} is ${err.error} in worksheet ${worksheet} on row ${err.row + 1}`);
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

  return { convertFileToJson };
};
