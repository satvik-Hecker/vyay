import Transaction from "../models/Transaction.js";
import { calculateBalance } from "../services/balance.service.js";
import mongoose from "mongoose";


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
            filter.category=category
        }
        if(type){
            filter.type=type
        }
        if(paymentMethod){
            filter.paymentMethod=paymentMethod
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

//analytics
export const getExpenseAnalytics = async(req,res)=>{
    try{
        const { startDate,endDate}= req.query;
        const matchStage = {
            userId: new mongoose.Types.ObjectId(req.user.userId),
            type: "expense"
        };

        if(startDate||endDate){
            matchStage.transactionDate={};

            if(startDate){
                matchStage.transactionDate.$gte= new Date (startDate);
            }
            if(endDate){
                matchStage.transactionDate.$lte= new Date (endDate);
            }
        }

        const analytics= await Transaction.aggregate([
            {$match: matchStage},
            {
                $group: {
                    _id: "$category",
                    total: {$sum: "$amount"}  
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    total:1
                }
            },
            { $sort: {total: -1}}
        ]);
        res.json(analytics);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};