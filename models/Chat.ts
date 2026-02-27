// models/Chat.ts
import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Can be a session ID or User ID
  userName: { type: String, default: "Anonymous" },
  messages: [{
    role: String,
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

export const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);