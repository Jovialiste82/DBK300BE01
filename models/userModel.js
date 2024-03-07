// backend/models/userModel.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Room from "./roomModel.js"; // Import the Room model

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      minlength: 5,
      maxlength: 20,
      validate: [
        {
          validator: function (value) {
            // Length validation
            return value.length >= 5 && value.length <= 20;
          },
          message: "Username must be between 5 and 20 characters.",
        },
        {
          validator: function (value) {
            // No special characters validation
            return /^[a-zA-Z0-9-]+$/.test(value);
          },
          message:
            "Username can only contain letters and numbers, and the '-' character.",
        },
        {
          validator: function (value) {
            // Existing custom validation for excluded values
            const excludedValues = ["admin", "jovialiste82", "gc120344"];
            const lowercaseValue = value.toLowerCase();
            return !excludedValues.includes(lowercaseValue);
          },
          message:
            'Username cannot be "Admin", "jovialiste82", "gc120344", etc.',
        },
      ],
    },
    dob: {
      type: String, // Assuming 'dob' is stored in "YYYY-MM-DD" format
      required: true,
    },
    rooms: {
      type: [String],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "member", // ["member", "admin", "mod", "advertiser"]
    },
    referral: {
      type: String,
      required: true,
      default: "MIRACLE", // Default referral code
    },
    balance: {
      type: Number,
      required: true,
      default: 50000,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isFrozen: {
      type: Boolean,
      required: true,
      default: false,
    },
    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Pre save hook to generate a random username if not provided
userSchema.pre("save", function (next) {
  if (!this.username) {
    // Generate a random number sequence for the username
    const randomNumber = Math.floor(Math.random() * 10000000000);
    this.username = `member-${randomNumber}`;
  }
  next();
});

// Pre save hook to generate room labels based on the user's date of birth
userSchema.pre("save", function (next) {
  if (this.isModified("dob") || this.isNew) {
    const dob = new Date(this.dob);
    const year = dob.getFullYear().toString();
    const month = (dob.getMonth() + 1).toString().padStart(2, "0");
    const day = dob.getDate().toString().padStart(2, "0");

    this.rooms = [year, `${month}-${day}`, `${year}-${month}-${day}`];
  }
  next();
});

// Revised post save hook for Room creation or update
userSchema.post("save", function (doc, next) {
  const dob = new Date(doc.dob);
  const year = dob.getFullYear().toString();
  const month = (dob.getMonth() + 1).toString().padStart(2, "0"); // JS months are 0-indexed, add 1 to match calendar months
  const day = dob.getDate().toString().padStart(2, "0");

  // Labels based on new requirements
  const dobFormatted = `${year}-${month}-${day}`; // "YYYY-MM-DD"
  const dayMonth = `${month}-${day}`; // "MM-DD"
  const yearLabel = year; // "YYYY"

  // Labels array with the new format
  const labels = [dobFormatted, dayMonth, yearLabel];

  labels.forEach((label) => {
    Room.findOneAndUpdate(
      { label: label }, // Ensure the 'label' field exists in your Room schema
      { $inc: { userCount: 1 } }, // Assuming you're incrementing a userCount field; adjust as needed
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();
  });

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
