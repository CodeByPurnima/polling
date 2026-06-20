import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware.js'
import * as controller from '../controllers/vote.controller.js'

const router = Router()

router.post('/poll/:id/vote', authenticate, controller.votePoll)
router.get('/poll/:id/vote/:optionId', authenticate, controller.getVotesData)
router.put('/poll/:id/vote', authenticate, controller.updateVote)

export default router
