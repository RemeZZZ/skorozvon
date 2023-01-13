import env from 'dotenv';
import Skorozvon from '../utils/Skorozvon.js';
import { addLead } from '../store/index.js';

env.config();

export async function sendLeads(request, response) {
  const { leads, tags, targets } = request.body;

  if (!leads) {
    response.status(402).send({ message: 'Bad request' });

    return;
  }

  leads.forEach((item) => {
    addLead(item.inn, item);
  });

  Skorozvon.sendLeads(leads, targets, tags);

  response.send({ message: 'ok' });
}
