import useDataContext from "./useDataContext";
import Papa from 'papaparse'
import readXlsxFile from "read-excel-file";

const ADD_SLUDGE_PARAMS_JSON = "ADD_SLUDGE_PARAMS_JSON";
const ADD_REFERENCE_TABLE = "ADD_REFERENCE_TABLE";
const ADD_SLUDGE_PRODUCTION = "SLUDGE_PRODUCTION";
const SET_FILE = "SET_FILE";
const TOGGLE_UPLOAD = "TOGGLE_UPLOAD";

const initialState = {
  files: [],
  errors: [],
  isValid: true,
  paramsInput: undefined,
  referenceInput: undefined,
  productionInput: undefined,
  triggerUpload: false,
  upload: false,
  validFileNames: {
    'sludge-params.csv': {
      type: "SLUDGE_PARAMS",
      fileType: 'csv'
    },
    'yw_reference_tables.xlsx':{
      type: 'REFERENCE_TABLE"',
      fileType: 'xlsx'
    },
    'sludge-production-v0.1.csv': {
      type: "SLUDGE_PRODUCTION",
      fileType: 'csv'
    }
  }
}

export const fileReducer = (state, { type, payload }) => {

  switch (type) {

    case ADD_SLUDGE_PARAMS_JSON:{
      const newState =  {...state, paramsInput: payload}
      return newState;
    }

    case ADD_REFERENCE_TABLE: {
      let newState = {...state, referenceInput: payload}
      return newState;
    }
    case ADD_SLUDGE_PRODUCTION: {
      let newState = {...state, productionInput: payload}
      return newState;
    }
    case SET_FILE: {
      const newState = {
        ...state,
        files: [...state.files, payload]
      }
      return newState;
    }
    case TOGGLE_UPLOAD: {
      return {...state, upload: !state.upload}
    }
    default:
      return state;
  }

}

export const setFile = (dispatch) => (file) => {
  dispatch({type: SET_FILE, payload: file[0]});
}


export const isValidFileName = (file) => {
  let validFilenames = {
    'sludge-params.csv': {
      type: "SLUDGE_PARAMS",
      fileType: 'csv'
    },
      'yw_reference_tables.xlsx':{
        type: 'REFERENCE_TABLE"',
        fileType: 'xlsx'
      },
      'sludge-production-v0.1.csv': {
        type: "SLUDGE_PRODUCTION",
        fileType: 'csv'
      }
    };
  return {
    isValid: !!validFilenames[file.name],
    type: validFilenames[file.name].type,
    fileType: validFilenames[file.name].fileType
  };
}


export const convertSludgeParams = (data, dispatch) =>{
  dispatch({type:ADD_SLUDGE_PARAMS_JSON, payload:data})
}

export const convertSludgeProduction = (data, dispatch) => {
  dispatch({type:ADD_SLUDGE_PRODUCTION, payload:data});
}

const getconversionMethod = (fileType) =>{
    switch(fileType) {
      case "SLUDGE_PARAMS":
        return (dispatch) => (data) =>{
          return convertSludgeParams(data.data, dispatch);
        }
      case "SLUDGE_PRODUCTION":
        return (dispatch) => (data) => {
          return convertSludgeProduction(data.data, dispatch)
        }
      default:
        return
   }
}

export const toggleUpload = (dispatch) => () =>  {
  dispatch({ type: TOGGLE_UPLOAD})
}

export const convertFileToJson =  (dispatch) => async (loadedFile ) => {
  let file = loadedFile[0];
  const {type, fileType} = isValidFileName(file);
  dispatch({type: SET_FILE, payload: file.name});

  if(fileType === 'csv'){
    let conversionFunction = getconversionMethod(type)(dispatch);
    Papa.parse(file, {
      complete: conversionFunction,
      config: {
        delimiter: ",",
        skipEmptyLines: "greedy",
        newline: '\n',
        delimitersToGuess: [','],
        header: true
      }
    });
  }else {

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
         dispatch({type: ADD_REFERENCE_TABLE, payload: retVal});
       });

      });
  }

}



export const { Provider, Context } =
  useDataContext(fileReducer, { convertFileToJson, setFile, toggleUpload }, initialState);

