const mongoose = require("mongoose");

const { Schema } = mongoose;

const inquiriesModel = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    farmSize: {
      type: String,
      default: "",
    },
    recommendations: {
      type: String,
      default: "",
    },
    message: {
      type: String,
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("inquiries", inquiriesModel);
