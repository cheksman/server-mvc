const mongoose = require("mongoose");

const { Schema } = mongoose;

const tractorModel = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    brand: {
      type: String,
    },
    model: {
      type: String,
    },
    tractorType: {
      type: String,
    },
    tractorRating: {
      type: String,
    },
    purchaseYear: {
      type: String,
    },
    manufactureYear: {
      type: String,
    },
    chasisNum: {
      type: String,
    },
    plateNum: {
      type: String,
    },
    insurance: {
      type: String,
      enum: ["Insured", "Not Insured"],
      default: "web",
    },
    insuranceCompany: {
      type: String
    },
    insuranceExpiry: {
      type: String
    },
    state: {
      type: String,
    },
    lga: {
      type: String,
    },
    address: {
      type: String,
    },
    tracker: {
      type: String,
      default: "No"
    },
    tractorImageUrl: {
      type: String
    },
    status: {
      type: String,
      default: 'unverified',
      enum: ['verified', 'unverified']
    },
    assigned: {
      type: Boolean,
      default: false
    },
    assignedTo: {
      type: mongoose.Types.ObjectId,
      ref: "user"
    }
  },
  { timestamps: true }
);

export default mongoose.model("tractor", tractorModel);
