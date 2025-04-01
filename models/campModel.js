const mongoose = require("mongoose");

const campSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  date: { type: Date, required: true },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  description: String,
  bloodGroups: [String]
}, { timestamps: true });

module.exports = mongoose.model("Camp", campSchema);