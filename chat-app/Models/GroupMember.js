
const mongoose = require("mongoose");

const groupMemberSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
      required: true
    },

    status: {
      type: String,
      enum: ["active", "pending", "removed"],
      default: "active"
    },

    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Un utilisateur ne peut être ajouté qu'une seule fois au même groupe
groupMemberSchema.index(
  { groupId: 1, userId: 1 },
  { unique: true }
);

const GroupMember = mongoose.model(
  "GroupMember",
  groupMemberSchema
);

module.exports = GroupMember;
