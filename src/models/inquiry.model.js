const mongoose = require("mongoose");

const { Schema } = mongoose;

const inquiriesModel = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    message: {
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
