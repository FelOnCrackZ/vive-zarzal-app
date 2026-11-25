import { Router } from 'express';
import { authRouter } from './authRouter.js';
import { userRouter } from './userRouter.js';
import { documentRouter } from './documentRouter.js';



const router = Router();

router.use(authRouter);
router.use(userRouter);
router.use(userRouter);
router.use(documentRouter);

export default router;
