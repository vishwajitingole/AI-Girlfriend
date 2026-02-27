// models/Schema.ts
import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String },
  messages: [{
    role: String,
    content: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Exporting Chat
export const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);