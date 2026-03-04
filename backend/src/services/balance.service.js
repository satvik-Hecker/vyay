import Transaction from "../models/Transaction.js";


export const calculateBalance=  async(userId)=> {
    const transactions = await Transaction.find({userId});
    
    let income =0;
    let expense=0;
    let cashBalance=0;
    let bankBalance=0;

    transactions.forEach((tx)=> {
        if(tx.type==="income"){
            income+=tx.amount;

            if(tx.paymentMethod==="cash") cashBalance+=tx.amount;
            if(tx.paymentMethod==="bank") bankBalance+=tx.amount;
        }else{
            expense+=tx.amount;

            if(tx.paymentMethod==="cash") cashBalance-=tx.amount;
            if(tx.paymentMethod==="bank") bankBalance-=tx.amount;
        }
    });

    return {
        income,
        expense,
        totalBalance: income - expense,
        cashBalance,
        bankBalance
    }
}