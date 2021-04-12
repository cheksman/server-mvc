const mongoose = require("mongoose");
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const leasorSchema = new Schema(
  {
    leasor: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      enum: ["completed", "assigned", "processing", "declined", "accepted"],
      default: "processing",
    },
    tractorsAssigned: [{
      type: mongoose.Types.ObjectId,
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
    farmLocation: {
        type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("leasing", leasorSchema);
