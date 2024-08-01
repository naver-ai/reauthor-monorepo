import express from 'express';
import { QASet, ThreadItem } from '../config/schema';
import type {RequestWithUser} from './middlewares'
import { signedInUserMiddleware } from './middlewares';
import generateComment from '../utils/generateComment';
import generateKeywords from '../utils/generateKeywords';
import generateThemes from '../utils/generateThemes';
import generateQuestions from '../utils/generateQuestions';

var router = express.Router()

const generateQuestionsHandler = async (req: RequestWithUser, res) => {
  const uid = req.user._id;
  const tid = req.params.tid;
  const opt = parseInt(req.query.opt as string, 10)
  try {
    const questions = await generateQuestions(uid, tid, opt)
    const qaPromises = questions.map(async(question, index) => {
      const newQASet = new QASet({
        tid: tid,
        question: {content: question.question},
        selected: false
      })
      return newQASet.save()
    })
    const savedQASets = await Promise.all(qaPromises);
    const qaSetIds = savedQASets.map(qa => qa._id)
    const threadItem = await ThreadItem.findByIdAndUpdate(tid, 
      {$push: { questions: { $each: qaSetIds } }}
    )
    return res.json({
      questions: savedQASets
    })
  } catch (err) {
    res.json({
      err: err.message
    })
  }
}

const generateGuidelineHandler = async (req: RequestWithUser, res) => {
  const user = req.user
  const qid = req.params.qid
  const response = req.body.response
  try {
    const comments = await generateComment(user, qid, response)
    return res.json({
      comments: (comments as any).selected
    })
  } catch (err) {
    return res.json({
      err: err.message
    })
  }
}

const generateKeywordsHandler = async(req:RequestWithUser, res) => {
  const user = req.user
  const uid = user._id
  const qid = req.params.qid
  const opt = parseInt(req.query.opt as string, 10)
  try {
    const keywords = await generateKeywords(user, qid, opt)
    const updatedQuestion = await QASet.findByIdAndUpdate(qid, {$push: {keywords: {$each: keywords.map(item => item.keyword)}}})
    return res.json({
      keywords: keywords
    })
  } catch (err) {
    return res.json({
      err: err.message
    })
  }
}

const generateThemesHandler = async (req: RequestWithUser, res) => {
  const user = req.user;
  const uid = user._id
  try {
    const themes = await generateThemes(uid)
    res.json({
      themes: themes
    })
  } catch (err) {
    res.json({
      err: err.message
    })
  }
}

router.post('/comment/:qid', signedInUserMiddleware, generateGuidelineHandler)
router.get('/question/:tid', signedInUserMiddleware, generateQuestionsHandler)
router.get('/keywords/:qid', signedInUserMiddleware, generateKeywordsHandler)
router.get('/themes', signedInUserMiddleware, generateThemesHandler)


export default router;
