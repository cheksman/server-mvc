const mongoose = require("mongoose");

const { Schema } = mongoose;

const agentProgrammeModel = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    category: {
      type: String,
    },
    school: {
      type: String,
    },
    course: {
      type: String,
    },
    gradYear: {
      type: String,
    },
    email: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    identityType: {
      type: String,
    },
    identificationPic: {
      type: String,
    },
    profilePic: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("agentProgramme", agentProgrammeModel);
