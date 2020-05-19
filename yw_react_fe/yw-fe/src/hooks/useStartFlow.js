import React, {useMemo} from 'react';
import { Context as FileContext } from '../context/FileContext';
import { Context as FlowContext } from '../context/FlowContext';


export default () => {
  const { state }  = React.useContext(FileContext);
  const {state: { enabled} , start } = React.useContext(FlowContext);

  const fileStateValid = state.productionInput !== undefined
    && state.referenceInput !== undefined;


  React.useEffect(() => {
    if(fileStateValid && !enabled){
      start();
    }
  }, [fileStateValid, enabled, start]);

}
