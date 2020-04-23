/* eslint-disable no-param-reassign */
import { Router } from 'express';

import path from 'path';
import fs from 'fs';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import Transaction from '../models/Transaction';
// import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const data = await transactionsRepository.find();

  data.forEach(item => {
    delete item.category_id;
    delete item.created_at;
    delete item.updated_at;
    delete item.category.created_at;
    delete item.category.updated_at;
  });

  const balance = await transactionsRepository.getBalance();

  response.json({
    transactions: data,
    balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const createTransationService = new CreateTransactionService();
  const transaction = await createTransationService.execute({
    title,
    value,
    type,
    category,
  });
  delete transaction.updated_at;
  delete transaction.created_at;
  delete transaction.category_id;
  const transactionPayload = {
    ...transaction,
    category,
  };
  response.json(transactionPayload);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  let data = await transactionsRepository.findOne({
    where: {
      id,
    },
  });
  data = data as Transaction;
  const remove = await transactionsRepository.remove(data);
  response.json({ remove });
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService();
    const file = await importTransactionsService.execute({
      filename: request.file.filename,
    });
    response.json(file);
  },
);

export default transactionsRouter;
