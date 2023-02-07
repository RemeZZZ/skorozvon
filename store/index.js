import fs from 'fs';

const dir = process.cwd();

const leadsFileDir = `${dir}/data/leads.json`;

const leads = JSON.parse(fs.readFileSync(leadsFileDir, 'utf-8'));

export function getVtbConfig() {
  return JSON.parse(fs.readFileSync(`${dir}/data/vtb.regions.json`, 'utf-8'));
}

export function getLeads() {
  return leads;
}

export function getLeadById(id) {
  return leads[id];
}

export function addLead(inn, info) {
  leads[inn] = info;
}

setInterval(() => {
  fs.writeFileSync(leadsFileDir, JSON.stringify(getLeads()));
}, 10 * 1000);
