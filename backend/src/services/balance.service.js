import Transaction from "../models/Transaction.js";


export const calculateBalance=  async(userId)=> {
    const transactions = await Transaction.find({userId});
    
    let income =0;
    let expense=0;

    transactions.forEach((tx)=> {
        if(tx.type==="income"){
            income+=tx.amount;
        }else{
            expense+=tx.amount;
        }
    });

    return {
        income,
        expense,
        balance: income - expense,
    }
}