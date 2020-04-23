import Transaction from '../models/Transaction';
import readerCSV from '../config/uploadCsv';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  filename: string;
}
interface TypeDTO {
  type: 'income' | 'outcome';
}
class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const data = await readerCSV.getContentCSV(filename);
    const createTransationService = new CreateTransactionService();
    const responseArray: Transaction[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      const [title, type, value, category]: string = item;
      const valueConvert = parseInt(value, 10);
      // eslint-disable-next-line no-await-in-loop
      const transaction = await createTransationService.execute({
        title,
        value: valueConvert,
        type,
        category,
      });
      delete transaction.updated_at;
      delete transaction.created_at;
      responseArray.push(transaction);
    }
    return responseArray;
  }
}

export default ImportTransactionsService;
