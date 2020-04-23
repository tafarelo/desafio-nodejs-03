import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

export default {
  getContentCSV: async fileName => {
    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });
    const csvFilePath = path.resolve(__dirname, '..', '..', 'tmp', fileName);
    const readCSVStream = fs.createReadStream(csvFilePath);
    const parseCSV = readCSVStream.pipe(parseStream);
    const data: string[] = [];
    parseCSV.on('data', line => {
      data.push(line);
    });
    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });
    return data;
  },
};
