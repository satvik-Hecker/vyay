import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
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