import express from 'express';
import { createTransaction,getTransactions,deleteTransaction } from '../controllers/transaction.controller.js';
import { getBalance } from '../controllers/transaction.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { transactionValidator } from '../middlewares/validators/transaction.validator.js';
import { validate } from '../middlewares/validators/auth.validator.js';

const router= express.Router();

router.use(authMiddleware);
//get balance
router.get('/balance',getBalance)

//create
router.post('/',transactionValidator,validate,createTransaction);

//get all
router.get('/',getTransactions);

//delete
router.delete('/:id',deleteTransaction)


export default router