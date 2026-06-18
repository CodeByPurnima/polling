import { Router } from 'express'
import * as controller from '../controllers/analytics.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/poll/:id/analytics', authenticate, controller.getAnalytics)

export default router