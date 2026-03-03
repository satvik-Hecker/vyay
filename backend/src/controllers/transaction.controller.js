import Transaction from "../models/Transaction.js";

//temp user
const USER_ID ='test-user-123';

//create transaction
export const createTransaction = async(req, res)=> {
    try{
        const {type, amount, category,note}=req.body;
        const transaction = await Transaction.create({
            userId: USER_ID,
            type,
            amount,
            category,
            note,
        });
        res.status(201).json(transaction);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

//get trnsaction
export const getTransactions = async(req,res)=> {
    try{
        const transactions = await Transaction.find({ userId: USER_ID})
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
        await Transaction.findByIdAndDelete(id);
        res.json({message: "Transaction deleted"});
    }catch(error){
        res.status(500).json({message:error.message})
    }
}