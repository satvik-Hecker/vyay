import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },
        type: {
            type:String,
            enum: ["income", "expense"],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min:0
        },
        category: {
            type: String,
             enum: [
            "Salary",
            "Freelance",
            "Business",
            "Investment",
            "Gift",
            "Pocket Money",
            "Food & Dining",
            "Groceries",
            "Transport",
            "Rent",
            "Utilities",
            "Shopping",
            "Entertainment",
            "Travel",
            "Health",
            "Education",
            "Subscriptions",
            "Other"
            ],
            required: true,
        },
        paymentMethod: {
            type:String,
            enum: ["cash","bank"],
            required: true,
        },
        note: {
            type:String,
            trim: true,
        },
        transactionDate:{
            type:Date,
            default: Date.now,
        },
    },
    {timestamps:true}
);
transactionSchema.index({ userId: 1,transactionDate: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction