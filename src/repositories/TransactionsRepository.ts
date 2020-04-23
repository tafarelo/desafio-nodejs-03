import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionRepository = getRepository(Transaction);
    const transactions = await transactionRepository.find();
    const balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    transactions.forEach(item => {
      balance[item.type] += item.value;
    });

    balance.total = balance.income - balance.outcome;
    return balance;
  }
}

export default TransactionsRepository;
