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
    schoolQualification: {
      type: String
    },
    leadType: {
      type: String,
      enum: ["agent", "enlistor", "hire", "operator", "investor", "contact", "msp", "farmer"],
      default: "contact"
    },
    cvUrl: {
      type: String
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
    business: {
      type: String
    },
    contact: {
      type: String
    },
    crops: {
      type: [String]
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
