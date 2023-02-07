import express from 'express';
import auth from '../middlewares/auth.js';
import { sendLeads } from '../controllers/sendLeads.js';
import { vtbConfig } from '../controllers/config.js';

const router = express.Router();

router.get('/regions/vtb', vtbConfig);

router.use(auth);

router.post('/sendLeads', sendLeads);

export default router;
