const mongoose = require("mongoose");
import validator from "validator";

const { Schema } = mongoose;

const leadsModel = new Schema(
  {
    channel: {
      type: String,
      enum: ["web", "mobile"],
      default: "web"
    },
    leadType: {
      type: String,
      enum: ["agent", "enlistor", "hire", "operator", "investor", "contact"],
      default: "contact"
    },
    farmSize: {
      type: String
    },
    recommendations: {
      type: String
    },
    state: {
      type: String
    },
    lga: {
      type: String
    },
    town: {
      type: String
    },
    unit: {
      type: String
    },
    tractorNumber: {
      type: String
    },
    operatorNumber: {
      type: String
    },
    tractorBrands: {
      type: [String]
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  },
  { timestamps: true }
);

export default mongoose.model("lead", leadsModel);
