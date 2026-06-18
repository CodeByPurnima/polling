import { Router } from "express";
import * as controller from '../controllers/poll.controller.js'
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router()

router.post('/poll', authenticate, controller.createPoll)
router.get('/my-polls', authenticate, controller.getMyPolls)
router.get('/polls', controller.getAllPolls)
router.get('/poll/:id', controller.getPollById)
router.delete('/poll/:id', authenticate, controller.deletePollById)

export default router