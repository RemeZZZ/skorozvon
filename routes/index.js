import express from 'express';
import auth from '../middlewares/auth.js';
import { sendLeads } from '../controllers/sendLeads.js';

const router = express.Router();

router.use(auth);

router.post('/sendLeads', sendLeads);

export default router;
