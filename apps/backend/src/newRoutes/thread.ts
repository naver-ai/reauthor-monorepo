import express from 'express';
import {saveThreadItem, createThreadItem, getThreadList, getThreadData, getThreadTitleList} from '../newControllers/threadController';
var router = express.Router()

router.post('/saveThreadItem', saveThreadItem);
router.post('/createThreadItem', createThreadItem);
router.post('/getThreadList', getThreadList);
router.post ('/getThreadData', getThreadData);
router.post('/getThreadTitleList', getThreadTitleList)

export default router;

