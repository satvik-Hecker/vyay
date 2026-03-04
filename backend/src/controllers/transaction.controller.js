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

        //filtering
        const {category,type, paymentMethod,startDate, endDate}= req.query;
        
        const filter = {userId: req.user.userId};

        if(category){
            filter.category=category.toLowerCase()
        }
        if(type){
            filter.type=type.toLowerCase()
        }
        if(paymentMethod){
            filter.paymentMethod=paymentMethod.toLowerCase()
        }
        if(startDate || endDate){
            filter.transactionDate={};
        if(startDate){
            filter.transactionDate.$gte=new Date (startDate)
        }
        if(endDate){
            filter.transactionDate.$lte=new Date (endDate)
        }
    }

        //pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page-1)*limit;

        const totalTransactions = await Transaction.countDocuments(filter);
        const totalPages = Math.ceil(totalTransactions / limit);

        const transactions = await Transaction.find(filter)
        .sort({ transactionDate: -1})
        .skip(skip)
        .limit(limit);
        res.json({
            page,
            limit,
            totalTransactions,
            totalPages,
            transactions
        });

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