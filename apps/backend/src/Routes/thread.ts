import express from 'express';
import { ThreadItem, User } from "../config/schema"
import synthesizeSession from "../newUtils/synthesizeSession";var router = express.Router()


const createThreadItem = async (req, res) => {
  
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

const saveThreadItem = async (req, res) => {
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

const getOrientingInput = async (req, res) => {
  const tid = req.body.tid;
  try {
    const thread = await ThreadItem.findById(tid)
    
    //TODO fix orientingInput error
    res.json({
      //orientingInput: thread.orientingInput
    })
  } catch (err) {
    res.json({
      err: err.message
    })
  }
}

const getThreadList = async (req, res) => {
  const uid = req.body.uid
  try {
    // const user = await User.findById(uid).populate('threadRef').exec();
    const user = await User.findById(uid);
    return res.json({
      threadRef: user.threadRef
    })
  } catch (err) {
    return res.status(500).json({ message: 'Server error fetching thread list:' + err });
  }
}

const getThreadData = async (req, res) => {
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

const getThreadTitleList = async (req, res) => {
  const {tids} = req.body
  try {
    const thread_themes = await ThreadItem.find({_id: {$in: tids}}).select('theme')
    res.json({
      themes: thread_themes
    })
  } catch (err) {
    res.json({
      err: err.message
    })
  }
}

const synthesizeThread = async(req, res) => {
  const tid = req.body.tid
  const uid = req.body.uid
  console.log("THREaddata: ", tid)
  try {
    const synthesizedData = await synthesizeSession(tid, uid)
    res.json({
      synthesized: synthesizedData
    })
  } catch (err) {
    res.json({
      err: err.message
    })
  }
}

const saveSynthesized = async(req, res) => {
  const synthesized = req.body.synthesized;
  const tid = req.body.tid
  try {
    await ThreadItem.findByIdAndUpdate(tid, {$set: {
      synthesized: synthesized,
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
router.post('/saveThreadItem', saveThreadItem);
router.post('/createThreadItem', createThreadItem);
router.post('/getThreadList', getThreadList);
router.post ('/getThreadData', getThreadData);
router.post('/getThreadTitleList', getThreadTitleList)
router.post('/synthesizeThread', synthesizeThread)
router.post('/saveSynthesized', saveSynthesized)
router.post('/getOrientingInput', getOrientingInput)

export default router;
