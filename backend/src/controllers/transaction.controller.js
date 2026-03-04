import Transaction from "../models/Transaction.js";
import { calculateBalance } from "../services/balance.service.js";


//create transaction
export const createTransaction = async(req, res)=> {
    try{
        const {type, amount, category,paymentMethod, note, transactionDate}=req.body;
        const transaction = await Transaction.create({
            userId: req.user.userId,
            type,
            amount,
            category,
            paymentMethod,
            note,
            transactionDate
        });
        res.status(201).json(transaction);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

//get trnsaction
export const getTransactions = async(req,res)=> {
    try{
        const transactions = await Transaction.find({ userId: req.user.userId})
        .sort({ createdAt: -1});
        res.json(transactions)
    }catch(error){
        res.status(500).json({ message: error.message});
    }
};

//delete trans
export const deleteTransaction = async(req,res)=>{
    try{
        const {id}=req.params;
        const transaction=await Transaction.findOneAndDelete({
            _id:id,
            userId:req.user.userId
        });

        if(!transaction){
            return res.status(404).json({message: "Transaction not found"})
        }
        res.json({message: "Transaction deleted"});
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

export const getBalance = async(req,res)=>{
    try{
        const data= await calculateBalance(req.user.userId);
        res.json(data);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};