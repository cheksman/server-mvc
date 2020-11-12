const mongoose = require("mongoose");

const { Schema } = mongoose;

const tractorProfileModel = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    unit: {
      type: String,
      default: "0",
    },
    tractorBrands: {
      type: [String],
    },
    channel: {
      type: String,
      enum: ["web", "mobile"],
      default: "web"
    },
    gender: {
      type: String,
    },
    investorType: {
      type: String,
    },
    recommendations: {
      type: String,
    }
  },
  { timestamps: true }
);

export default mongoose.model("tractorProfile", tractorProfileModel);
