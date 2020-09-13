const mongoose = require("mongoose");

const { Schema } = mongoose;

const tractorProfileModel = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    tractorAmount: {
      type: Number,
      default: 0,
    },
    operatorAmount: {
      type: Number,
      default: 0,
    },
    tractorBrands: {
      type: [String],
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
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("tractorProfile", tractorProfileModel);
