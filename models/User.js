const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    password_otp: {
      otp: { type: Number },
      time: { type: Number },
      attempts: { type: Number, default: 4 },
      last_attempt_time: { type: Object },
      status: { type: Boolean, default: false },
    },
  },
  { timeseries: true }
);

module.exports = mongoose.model("User", userSchema);
