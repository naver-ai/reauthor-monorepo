import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IAIGuide extends Document {
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQASet extends Document {
  question: {label: string; content: string},
  keywords: string[],
  response: string,
  aiGuides?: IAIGuide[];
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IThreadItem extends Document {
  uid: mongoose.Types.ObjectId;
  theme: string;
  questions?: IQASet[];
  synthesized?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser extends Document {
  name: string;
  ucode: string;
  isKorean: boolean;
  initial_narrative: string;
  value_set: string[];
  background: string;
  threadRef: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export const AIGuideSchema = new Schema({
  content: {type: String},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date}
 })

AIGuideSchema.set('timestamps', true)

export const QASetSchema = new Schema({
  question: {
    type: {
      label: String,
      content: String
    },
    required: true
  },
  aiGuides: {
    type: [AIGuideSchema],
    default: []
  },
  keywords: [String],
  response: String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date}
 })

QASetSchema.set('timestamps', true);
 
export const ThreadItemSchema = new Schema({
   uid: {type: Schema.Types.ObjectId, ref: 'User', required: true},
   theme: {type: String, required: true},
   questions: {type: [QASetSchema]},
   synthesized: {type: String},
   createdAt: {type: Date, default: Date.now},
   updatedAt: {type: Date}
 });
 
ThreadItemSchema.set('timestamps', true)

export const UserSchema = new Schema({
   name: {type: String, required: true},
   ucode: {type: String, required: true},
   isKorean: {type: Boolean, required: true},
   initial_narrative: {type: String, required: true, default: ''},
   value_set: {type: [String], required: true, default: []},
   background: {type: String, required: true, default: ''},
   threadRef: {type: [Schema.Types.ObjectId], ref: 'ThreadItem', required: true, default: []},
   createdAt: {type: Date, default: Date.now},
   updatedAt: {type: Date}
 });
 
 UserSchema.set('timestamps', true);
 
export const QASet = mongoose.model<IQASet>('QASet', QASetSchema)
export const ThreadItem = mongoose.model<IThreadItem>('ThreadItem', ThreadItemSchema)
export const User = mongoose.model<IUser>('User', UserSchema)
