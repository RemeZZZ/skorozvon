import fs from 'fs';

const dir = process.cwd();

const leadsFileDir = `${dir}/data/leads.json`;

const leads = fs.readFileSync(leadsFileDir, 'utf-8');

export function getLeads() {
  return leads;
}

export function addLead(inn, info) {
  leads[inn] = info;
}

setInterval(() => {
  fs.writeFileSync(leadsFileDir, JSON.stringify(getLeads()));
}, 60 * 1000);
