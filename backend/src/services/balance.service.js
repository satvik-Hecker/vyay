import Transaction from "../models/Transaction.js";

const USER_ID="test-user-123";

export const calculateBalance=  async()=> {
    const transactions = await Transaction.find({userId: USER_ID});
    
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