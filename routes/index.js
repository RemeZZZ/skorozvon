import express from 'express';
import auth from '../middlewares/auth.js';
import { sendLeads } from '../controllers/sendLeads.js';
import { getOperators } from '../controllers/operators.js';
import { vtbConfig } from '../controllers/config.js';

const router = express.Router();

router.get('/regions/vtb', vtbConfig);

router.use(auth);

router.post('/sendLeads', sendLeads);

router.get('/operators', getOperators);

export default router;
