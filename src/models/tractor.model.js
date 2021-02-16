const mongoose = require("mongoose");

const { Schema } = mongoose;

const tractorModel = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
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
      enum: ["web", "mobile"],
      default: "web",
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
    tracker: {
      type: String,
      default: "no"
    },
    tractorImageUrl: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("tractor", tractorModel);
