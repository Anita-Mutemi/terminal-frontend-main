import { saveAs } from 'file-saver';
import { flatten } from 'flat';
import Papa from 'papaparse';

const useExportData = () => {
  const exportAsJson = (data, filename = 'data') => {
    const jsonString = JSON.stringify(data);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, `${filename}.json`);
  };

  const exportAsCsv = (data, filename = 'data') => {
    const flattenedData = flatten(data);
    const csvString = Papa.unparse([flattenedData]); // Wrapping in an array for PapaParse
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  };

  return { exportAsJson, exportAsCsv };
};

export default useExportData;
