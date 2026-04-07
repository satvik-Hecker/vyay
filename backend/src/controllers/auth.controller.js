import { registerUser,loginUser,requestPasswordReset, resetPassword } from "../services/auth.service.js";
import sendEmail from "../utils/sendEmail.js";

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
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        const { resetToken } = await requestPasswordReset(email);

        
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

       
        await sendEmail({
            email,
            subject: "Reset your Vyay Password",
            message: `Forgot your password? Click here to reset it: ${resetUrl}\n\nIf you didn't request this, please ignore this email.`,
           
        });

        res.status(200).json({
            message: "If an account exists, a reset link has been sent to your email.",
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const result = await resetPasswordService(token, password);

        res.status(200).json({
            message: "Password updated successfully! You can now log in.",
            ...result
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};