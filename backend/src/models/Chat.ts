import mongoose, { Schema, Document } from 'mongoose';

interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  messages: IMessage[];
  createdAt: Date;
  lastUpdated: Date;
}

const messageSchema = new Schema<IMessage>({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new Schema<IChat>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
});

const Chat = mongoose.model<IChat>('Chat', chatSchema);
export default Chat;
