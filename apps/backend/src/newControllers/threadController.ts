import { ThreadItem, User } from "../config/schema"
import { Request, Response } from "express";

const createThreadItem = async (req: Request, res: Response) => {
  
  const uid = req.body.uid
  const newThreadItem = new ThreadItem({
    uid: uid,
    theme: req.body.theme
  })
  try {
    const newThread = await newThreadItem.save()
    const threadid = newThread._id
    await User.findByIdAndUpdate(uid, {$push: {threadRef: threadid}})
    res.json({
      success: true,
      threadid: threadid
    })
  } catch (err) {
    res.json({
      success: false,
      err: err.message
    })
  }
}

const saveThreadItem = async (req: Request, res: Response) => {
  const tid = req.body.tid;
  const question = req.body.question
  const scaffoldingData = req.body.scaffoldingData
  const response = req.body.response
  try {
    await ThreadItem.findByIdAndUpdate(tid, {$set: {
      question: question,
      // scaffoldingData: scaffoldingData,
      response: response
    }})
    res.json({
      success: true
    })
  } catch (err) {
    res.json({
      success: false,
      err: err.message
    })
  }
}

const getThreadList = async (req: Request, res: Response) => {
  const uid = req.body.uid
  try {
    // const user = await User.findById(uid).populate('threadRef').exec();
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({
      threadRef: user.threadRef
    })
  } catch (err) {
    return res.status(500).json({ message: 'Server error fetching thread list:' + err });
  }
}

const getThreadData = async (req: Request, res: Response) => {
  const tid = req.body.tid
  try {
    const thread = await ThreadItem.findById(tid);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    return res.json({
      threadData: thread
    })
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching thread data' + err });
  }
}

export {createThreadItem, getThreadList, saveThreadItem, getThreadData}