import { Router } from "express";
import * as controller from '../controllers/auth.controller.js'
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router()

router.post('/signup', controller.signup)
router.post('/login', controller.login)
router.get('/me', authenticate, controller.getMe)

export default router 