import Papa from 'https://cdn.skypack.dev/papaparse';

const CSV_PATH = '../../Halloween Contest Photo Submission(Sheet1).csv';

export function getSubmissions() {
  const url = `${CSV_PATH}?_ts=${Date.now()}`;
  return fetch(url, { cache: 'no-store' })
    .then(response => response.text())
    .then(csvText => new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: results => resolve(results.data),
        error: err => reject(err)
      });
    }));
}