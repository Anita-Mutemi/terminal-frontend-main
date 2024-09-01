import { useState } from 'react';
import Papa from 'papaparse';

const useCsvDownloader = (filename) => {
  const [downloadStatus, setdownloadStatus] = useState('');

  const downloadCsv = (data) => {
    try {
      const csv = Papa.unparse(data);
      const file = new Blob([csv], { type: 'text/csv' });
      const link = document.createElement('a');
      link.download = filename;
      link.href = URL.createObjectURL(file);
      link.click();
      setdownloadStatus('success');
    } catch (error) {
      console.error(error);
      setdownloadStatus('error');
    }
  };

  return { downloadCsv, downloadStatus };
};

export default useCsvDownloader;
