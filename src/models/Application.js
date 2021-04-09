const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    DOB: {
      type: String,
      required: true,
    },
    college: {
      type: String,
      required: true,
    },
    university: {
      type: String,
      required: true,
    },
    ans1: {
      type: String,
    },
    ans2: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("application", applicationSchema);
