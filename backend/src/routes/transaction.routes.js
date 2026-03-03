import express from 'express';
import { createTransaction,getTransactions,deleteTransaction } from '../controllers/transaction.controller.js';
import { getBalance } from '../controllers/transaction.controller.js';

const router= express.Router();

//get balance
router.get('/balance',getBalance)

//create
router.post('/',createTransaction);

//get all
router.get('/',getTransactions);

//delete
router.delete('/:id',deleteTransaction)


export default router