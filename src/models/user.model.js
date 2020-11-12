const mongoose = require("mongoose");
import bcrypt from "bcryptjs";
import validator from "validator";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fname: {
      type: String,
      default: "",
    },
    lname: {
      type: String,
      default: "",
    },
    email: {
      trim: true,
      type: String,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "{VALUE} is not a valid email",
      },
    },
    password: {
      type: String,
      default: "tractrac",
    },
    userRole: {
      type: [String],
      required: true,
      default: ["user"],
      enum: [
        "superadmin",
        "admin",
        "msp",
        "investor",
        "agent",
        "operator",
        "farmer",
        "enlistor",
        "hire",
        "user",
      ],
    },
    activatedRole: {
      type: [String],
      enum: ['farmer', 'investor', 'enlistor', 'msp', 'agent', 'operator', 'hire'],
      default: []
    },
    phone: {
      type: String,
      default: "",
      required: true,
      trim: true,
    },
    gender: {
      type: String,
    },
    pixURL: {
      type: String,
      default:
        "https://res.cloudinary.com/volantis-tides/image/upload/v1567868749/Exalt/ShelterOfGlory/ProfilePix/man-avatar_n8btpc.png",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  bcrypt.hash(this.password, 9, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }
      resolve(same);
    });
  });
};

export default mongoose.model("user", userSchema);
