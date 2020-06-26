export const getColumn = (inputOptions, option) => {
  let columnIdx = 0;
  inputOptions.forEach((row) => {
    if(row.items) {
      let found = row.items.find(x => x.id === option.id)
      if(!!found){
        columnIdx = row.idx;
      }
    }
  });
  return columnIdx;
}

export const buildInputOption = (setInputOptions, inputOptions) => (option) => {
  let idx = getColumn(inputOptions, option);
  if(idx < inputOptions.length){
    setInputOptions([...inputOptions.slice(0, idx), {...option, idx: idx + 1}])
  }else{
    setInputOptions([...inputOptions, {...option, idx: idx +1}])
  }
}

export default {
  buildInputOption,
  getColumn
}
