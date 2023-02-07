import fetch from 'node-fetch';
import env from 'dotenv';
import https from 'https';
import { getRandomNumber } from './random.js';

env.config();

const agent = new https.Agent({
  rejectUnauthorized: false,
});

class Skorozvon {
  constructor() {
    this.getAccesToken().then((result) => {
      this.token = result.access_token;
      this.refreshToken = result.refresh_token;

      setInterval(() => {
        this.refresh();
      }, 60 * 1000 * 60);
    });
  }

  async getAccesToken() {
    const { CLIENT_ID, CLIENT_SECRET, CLIENT_USERNAME, API_KEY, API_URL } =
      process.env;

    const result = await fetch(
      `${API_URL}/oauth/token?grant_type=password&username=${CLIENT_USERNAME}&api_key=${API_KEY}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
      {
        method: 'POST',

        agent: agent,
      },
    );

    return await result.json();
  }

  async refresh() {
    const { CLIENT_ID, CLIENT_SECRET, API_URL } = process.env;

    const headers = {
      Authorization: `Bearer ${this.token}`,
    };

    const result = await fetch(
      `${API_URL}/oauth/token?grant_type=refresh_token&refresh_token=${this.refreshToken}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
      {
        method: 'POST',

        headers: headers,
        agent: agent,
      },
    );

    const auth = await result.json();

    this.token = auth.access_token;
    this.refreshToken = auth.refresh_token;

    return auth;
  }

  async sendLeads(leads, targets, tags = []) {
    const headers = {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };

    console.log(leads, tags, targets);

    const formatedLeads = leads.map((item) => {
      return {
        name: item.orgName || `ИП ${item.name}`,
        phones: item.phones,
        address: item.address,
        custom_fields: {
          FIELD_20000002891: item.inn,
          FIELD_20000002460: item.ogrn,
          //FIELD_20000002889: `${process.env.HOST_URL}/sendLead/?inn=${item.inn}`,
          FIELD_20000002888: item.otcritie,
          FIELD_20000002887: item.tinkov,
          FIELD_20000002886: item.alpha,
          FIELD_20000002885: item.vtb,
        },
      };
    }, []);

    const formatedLength = formatedLeads.length;

    const sortedLeads = targets.reduce((targetsLeads, target) => {
      const percentage = +target.percentage / 100;

      const count = formatedLength * percentage;

      let leads = [];

      for (let i = 0; i < count; i++) {
        const random = getRandomNumber(1);

        if (random) {
          leads.push(formatedLeads.pop());
        } else {
          leads.push(formatedLeads.shift());
        }
      }

      targetsLeads.push({
        targets: [target.id],
        data: leads.filter((lead) => lead),
      });

      return targetsLeads;
    }, []);

    if (formatedLeads.length) {
      sortedLeads.push({
        targets: targets.map((target) => target.id),
        data: formatedLeads.filter((lead) => lead),
      });
    }

    sortedLeads.forEach((item, index) => {
      setTimeout(() => {
        fetch(`${process.env.API_URL}/api/v2/leads/import`, {
          method: 'POST',

          headers: headers,

          body: JSON.stringify({
            data: item.data,
            targets: item.targets,
            tags: tags,
          }),
        });
      }, 1000 * index);
    });
  }
}

export default new Skorozvon();
