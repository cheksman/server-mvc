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
    tractorNumber: {
      type: String,
    },
    reason: {
      type: String,
    },
    state: {
      type: String,
    },
    lga: {
      type: String,
    },
    town: {
      type: String,
    },
    channel: {
      type: String,
      enum: ["web", "mobile"],
      default: "web"
    }
  },
  { timestamps: true }
);

export default mongoose.model("inquiries", inquiriesModel);
