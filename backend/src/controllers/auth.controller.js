import { registerUser,loginUser } from "../services/auth.service.js";

export const register = async(req,res)=>{
    try{
        const result = await registerUser(req.body);

        return res.status(201).json({
            message: "User registered successfully",
            ...result,
        });
    }catch(error){
        return res.status(400).json({
            message: error.message,
        });
    }
};

export const login = async(req,res)=> {
    try{
        const result = await loginUser(req.body);

        return res.status(200).json({
            message: "Login Successful",
            ...result,
        });
    }catch(error){
        return res.status(400).json({
            message: error.message,
        });
    }
};