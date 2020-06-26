import axios from 'axios';

export default () => {
  const downloadFile = fileToDownload => {
    axios({
      url:'/latest-output',
      method: 'post',
      data: {
        fileName: data.fileName
      },
      headers: {
        "Content-Type": "application/json"
      }
    }).then(payload => {
      debugger;
    })
  };

  return {downloadFile};
};
