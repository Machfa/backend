const mongoose = require("mongoose");

const rendezvousSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    doctorId: {
      type: String,
      required: true,
    },
    userInfo: {
      type: String,
      required: true,
    },
    date: {
        type: String,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    avatar:{
      type: String
    }
  },
  { timestamps: true }
);

const rendezvous = mongoose.model("rendezvous", rendezvousSchema);

module.exports = rendezvous;
