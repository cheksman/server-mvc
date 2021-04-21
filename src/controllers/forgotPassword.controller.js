<<<<<<< HEAD
import bcrypt from "bcryptjs";
import { findUser } from "../services/user.services";
import userModel from "../models/user.model";
import {sendOTP, verifyOTP} from "../utils/twilioService"
const twilio = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);
=======
import {findUser} from "../services/user.services";
import userModel from "../models/user.model";

const twilio = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

export const verifyPhoneNumber = async(req,res,next) => {
  try {
      const { phoneNumber } = req.body;
      sendOTP(req,res,next,phoneNumber);
      
  }catch (error) {
    return({
      message: "Error, please try again",
      error: error,
    });
  }
};


export const verifyCode = async(req,res,next) =>{
   const { code } = req.body;
   const updatedNumber = "+2349012187549"
   let verificationResult;
    try{
        verificationResult = await verifyOTP(code,updatedNumber)

        if(verificationResult.status === "approved"){
            return res.status(200).json({
            message: "number verified! Proceed to reset password"
            });
           
                }else{
                    return res.status(400).json({
                    message: "invalid code"
                    });
                }
        
          }catch (error) {
          return next({
            message: "Error, please try again",
            error: error,
            });
        }
        
}

export const resetPassword = async(req,res,next) => {
    try{
        const { password, confirmPassword } = req.body;
        if(password === confirmPassword){
           await bcrypt.hash(confirmPassword, 9, async (err, hash) => {
                if (err) {
                return next(err);
                }
                this.confirmPassword = hash;
                const newPassword = { 
            $set: {
                password: hash
            }
                }
             const phoneNumber = {phone : "09062344509"};
             const updatePassword =  await userModel.updateOne(phoneNumber,newPassword)
               if(!updatePassword) {
                    return res.status(400).json({
                        message: "unsuccessful! Password could not be updated",
                        error: error
                        });
               }
               else{
                return res.status(200).json({
                        message: "Password updated successfully"
                        });
               }
            });

        }
        else{
             return res.status(200).json({
                message: "Password mismatch"
            }) 
        }
        

    }catch(error){
        return({
        message: "Error, please try again",
        error: error,
        });
    }
}

 