import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/User.js'

export const registerUser = async(userData)=>{
    const {name,email,password} = userData;

    //check if user exists already
    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new Error("Email already registered");
    }

    //hashing pwd
    const hashedPassword = await bcrypt.hash(password,10);

    //create user
    const user = await User.create({
        name,
        email,
        password : hashedPassword,
    });

    //generate jwt
    const token = jwt.sign(
        {userId: user._id},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        token,
    };
};

export const loginUser = async({email,password})=> {
    const user = await User.findOne({email});
    if(!user){
        throw new Error("Invalid email or password");
    }

    const isMatch= await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error("Invalid email or password")
    }

    const token = jwt.sign(
        {userId: user._id},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );

    return {
        user:{
            id: user._id,
            name:user.name,
            email:user.email,
        }, 
        token,
    };
};

export const requestPasswordReset = async (email)=> {
    const user = await User.findOne({email});
    if(!user) {
        return { message: "If an account exists with this email, a reset link has been sent."};
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();
    return { resetToken, email };
}

export const resetPassword = async(token,newPassword)=> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new Error("Token is invalid or has expired");
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    return { message: "Password reset successful" };
}