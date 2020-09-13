const mongoose = require("mongoose");

const { Schema } = mongoose;

const leadsModel = new Schema(
  {
    fname: {
      type: String,
      default: "",
    },
    lname: {
      type: String,
      default: "",
    },
    email: {
      trim: true,
      type: String,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "{VALUE} is not a valid email",
      },
    },
    phone: {
      type: String,
      default: "",
      required: true,
      trim: true,
    },
    interests: {
      type: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.model("lead", leadsModel);
