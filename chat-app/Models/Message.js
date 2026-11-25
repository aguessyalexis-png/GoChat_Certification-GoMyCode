//représente chaque message envoyé dans une conversation.

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: function () {
        return this.type === "text";
      },
      trim: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "file", "audio", "video"],
      default: "text",
      required: true,
    },

    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        filename: {
          type: String,
        },
        mimeType: {
          type: String,
        },
        size: {
          type: Number,
        },
      },
    ],

    editedAt: {
      type: Date,
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
