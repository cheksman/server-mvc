const mongoose = require("mongoose");
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const leasorSchema = new Schema(
  {
    leasor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      enum: ["completed", "assigned", "processing", "declined", "accepted"],
      default: "processing",
    },
    tractorsAssigned: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "tractor",
    }],
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    farmSize: {
      type: String,
    },
    tractorNumberRequired: {
      type: String,
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
    amountToPay: {
      type: String,
    },
    services: {
      type: [String],
    }
  },
  { timestamps: true }
);

export default mongoose.model("leasing", leasorSchema);
