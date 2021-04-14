import {findUser} from "../services/user.services";
import userModel from "../models/user.model";
const twilio = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

export const sendOTP = async (req, res, next) => {
 
 try{
    const { phoneNumber } = req.body;
    const updatedNumber = phoneNumber.replace(0, '+234')
    let user = null;

    // check if a user with the phoneNumber entered already exist
    user = await findUser(phoneNumber); 
    if (!user || phoneNumber === '') {
      return res.status(403).json({
        message: "Phone number is not registered",
      });
    }
    //if it exist, send an otp to the phone number entered
          else{
              twilio.verify.services(process.env.SERVICE_ID).verifications.create({
                  to: updatedNumber,
                  channel: 'sms'            
                })
                .then((data) => {
                    console.log(data)
                    res.status(200).send("Successful! Please check your messages.")
                })
          }
          
        } catch (error) {
          return next({
            message: "Error, please try again",
            error: error,
          });
        }

 }

 export const verifyOTP = async (req, res, next) => {
 
 try{
    const { phoneNumber } = req.body;
    const updatedNumber = phoneNumber.replace(0, '+234')
    const {code} = req.body

    
    if (!code || code === '') {
      return res.status(403).json({
        message: "Invalid code, please enter your otp",
      });
    }
          else{
              twilio.verify.services(process.env.SERVICE_ID).verificationChecks.create({
                  to: "+2349012187549",
                  code: code            
                })
                .then((data) => {
                    
                    res.status(200).send("Successful! Proceed to change your password.")
                })
          }
          
        } catch (error) {
          return next({
            message: "Error, please try again",
            error: error,
          });
        }

 }
 
export const resetPassword = async (req,res,next) => {
    try{
        const phoneNumber = "08134418109";
        const { password,cPassword } = req.body;
        const update = {password : password};

        if(password === cPassword){
            const updatePassword = await userModel.findOneAndUpdate({phoneNumber, update})
   
            return res.status(201).json({
            message: "password succesfully updated!",
            });
        } 
        else{
            return res.status(403).json({
            message: "Error, please try again",
      });
        }
    }catch (error) {
          return next({
            message: "Error, please try again",
            error: error,
          });
        }
}
