//représente un espace d'échange entre deux utilisateurs ou plusieurs membres d'un groupe

const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null
    },

    title: {
      type: String,
      trim: true,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
