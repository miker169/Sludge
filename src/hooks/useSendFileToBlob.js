import axios from 'axios';

export default () => {
  const sendFileToBlob = loadedFile => {
    const data = new FormData();
    data.append('file', loadedFile)
    axios.post('/file-upload', data)
      .then(res => {
        console.log(res.statusText)
      })
  };

  return {sendFileToBlob};
};
