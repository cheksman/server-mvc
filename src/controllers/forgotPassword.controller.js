// <<<<<<< HEAD
// import bcrypt from "bcryptjs";
// import { findUser } from "../services/user.services";
// import userModel from "../models/user.model";
// import {sendOTP, verifyOTP} from "../utils/twilioService"
// const twilio = require("twilio")(
//   process.env.ACCOUNT_SID,
//   process.env.AUTH_TOKEN
// );
// =======
// import {findUser} from "../services/user.services";
// import userModel from "../models/user.model";
// const twilio = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
// >>>>>>> forgotPassword

// export const verifyPhoneNumber = async(req,res,next) => {
//   try {
//       const { phoneNumber } = req.body;
//       sendOTP(req,res,next,phoneNumber);
      
//   }catch (error) {
//     return({
//       message: "Error, please try again",
//       error: error,
//     });
//   }
// };

// <<<<<<< HEAD
// export const verifyCode = async(req,res,next) =>{
//    const { code } = req.body;
//    const updatedNumber = "+2349012187549"
//    let verificationResult;
//     try{
//         verificationResult = await verifyOTP(code,updatedNumber)

//         if(verificationResult.status === "approved"){
//             return res.status(200).json({
//                 message: "number verified! Proceed to reset password"
//             })
// =======
//     // check if a user with the phoneNumber entered already exist
//     user = await findUser(phoneNumber); 
//     if (!user || phoneNumber === '') {
//       return res.status(403).json({
//         message: "Phone number is not registered",
//       });
//     }
//     //if it exist, send an otp to the phone number entered
//           else{
//               twilio.verify.services(process.env.SERVICE_ID).verifications.create({
//                   to: updatedNumber,
//                   channel: 'sms'            
//                 })
//                 .then((data) => {
//                     console.log(data)
//                     res.status(200).send("Successful! Please check your messages.")
//                 })
//           }
          
//         } catch (error) {
//           return next({
//             message: "Error, please try again",
//             error: error,
//           });
// >>>>>>> forgotPassword
//         }
//         else{
//                 return res.status(400).json({
//                 message: "invalid otp"
//             })
//             }
//     }catch(error){
//       return({
//         message: "Error, please try again",
//         error: error,
//     });
//     }
// }

// export const resetPassword = async(req,res,next) => {
//     try{
//         const { password, confirmPassword } = req.body;
//         if(password === confirmPassword){
//            await bcrypt.hash(confirmPassword, 9, async (err, hash) => {
//                 if (err) {
//                 return next(err);
//                 }
//                 this.confirmPassword = hash;
//                 const newPassword = { 
//             $set: {
//                 password: hash
//             }
//                 }
//         const phoneNumber = {phone : "09062344509"};
//              const updatePassword =  await userModel.updateOne(phoneNumber,newPassword)
//                if(!updatePassword) {
//                     return res.status(400).json({
//                         message: "unsuccessful! Password could not be updated",
//                         error: error
//                         });
//                }
//                else{
//                 return res.status(200).json({
//                         message: "Password updated successfully"
//                         });
//                }
//             });

// <<<<<<< HEAD
//         }
//         else{
//              return res.status(200).json({
//                 message: "Password mismatch"
//             }) 
//         }
        

//     }catch(error){
//         return({
//         message: "Error, please try again",
//         error: error,
//     });
//     }
// }
// =======
//  export const verifyOTP = async (req, res, next) => {
 
//  try{
//     const { phoneNumber } = req.body;
//     const updatedNumber = phoneNumber.replace(0, '+234')
//     const {code} = req.body

    
//     if (!code || code === '') {
//       return res.status(403).json({
//         message: "Invalid code, please enter your otp",
//       });
//     }
//           else{
//               twilio.verify.services(process.env.SERVICE_ID).verificationChecks.create({
//                   to: "+2349012187549",
//                   code: code            
//                 })
//                 .then((data) => {
                    
//                     res.status(200).send("Successful! Proceed to change your password.")
//                 })
//           }
          
//         } catch (error) {
//           return next({
//             message: "Error, please try again",
//             error: error,
//           });
//         }

//  }
 
// export const resetPassword = async (req,res,next) => {
//     try{
//         const phoneNumber = "08134418109";
//         const { password,cPassword } = req.body;
//         const update = {password : password};

//         if(password === cPassword){
//             const updatePassword = await userModel.findOneAndUpdate({phoneNumber, update})
   
//             return res.status(201).json({
//             message: "password succesfully updated!",
//             });
//         } 
//         else{
//             return res.status(403).json({
//             message: "Error, please try again",
//       });
//         }
//     }catch (error) {
//           return next({
//             message: "Error, please try again",
//             error: error,
//           });
//         }
// }
// >>>>>>> forgotPassword
