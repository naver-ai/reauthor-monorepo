export interface IAIGuide extends Document {
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQASetBase {
  question: {label?: string; content: string},
  keywords: string[],
  response: string,
  aiGuides?: IAIGuide[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQASetWithIds extends IQASetBase {
  _id: string,
  tid: string
}

export interface IThreadBase {
  theme: string;
  synthesized?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IThreadWithQuestionIds extends IThreadBase {
  _id: string,
  questions: Array<string | IQASetWithIds>,
  uid: string
}

export interface IUserBase {
  alias: string;
  passcode: string;
  name?: string | undefined;
  isKorean: boolean;
  initial_narrative: string | undefined
  value_set: string[];
  background: string | undefined
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserWithThreadIds extends IUserBase {
  _id: string,
  threadRef: Array<string>
}