import Papa from 'papaparse';
import React from 'react';
import { validate } from 'jsonschema';

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

export default (setFiles, setPayload, payload) => {
  const [errors, setErrors] = React.useState({});

  const parseExcelFile = file => {
    readXlsxFile(file, { getSheets: true }).then(sheets => {
      let i = 0;
      let items = sheets.map(async obj => {
        i++;
        const schema = getSchema(obj.name);
        let item;
        const retVal = {}
        item = await readXlsxFile(file, { sheet: i, schema });

        if (item.errors.length > 0) {
          setErrors(currentErrors => {
            return {
              ...currentErrors,
              referenceError: {
                ...currentErrors.referenceError,
                [obj.name]: item.errors,
              },
            };
          });
        }
        return {
          [obj.name]: item.rows,
        };
      });

      Promise.all(items).then(data => {
       let refData = data.reduce((acc, item) => {
         let key = Object.keys(item)[0];
         acc[key] = item[key];
         return acc;
       }, {})
        if (!errors.referenceError) {
          setPayload({ ...payload, referenceInput: refData });
        }
      });
    });
  };

  const parseCsvFile = file => {
    Papa.parse(file, {
      complete: ({ data, errors }) => {
        let valid;
        if (!errors.length) {
          valid = validate(data, productionSchema);
          if (valid.errors.length) {
            setErrors(valid.errors);
          } else {
            setPayload({ ...payload, productionInput: data });
          }
        } else {
          setErrors(errors);
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

  return { convertFileToJson, errors };
};
