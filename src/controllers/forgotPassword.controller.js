import { findUser } from "../services/user.services";
const twilio = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

export const sendOTP = async (req, res, next) => {
  console.log("running");

  try {
    const { phoneNumber } = req.body;
    const updatedNumber = phoneNumber.replace(0, "+234");
    let user = null;

    // check if a user with the phoneNumber entered already exist
    user = await findUser(phoneNumber);
    if (!user || phoneNumber === "") {
      return res.status(403).json({
        message: "Phone number is not registered",
      });
    }
    //if it exist, send an otp to the phone number entered
    else {
      twilio.verify
        .services(process.env.SERVICE_ID)
        .verifications.create({
          to: updatedNumber,
          channel: "sms",
        })
        .then((data) => {
          res.status(200).send("Successful! Please check your messages.");
        });
    }
  } catch (error) {
    return next({
      message: "Error, please try again",
      error: error,
    });
  }
};
