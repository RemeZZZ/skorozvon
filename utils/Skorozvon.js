import fetch from 'node-fetch';
import env from 'dotenv';
import https from 'https';

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

    const result = await fetch(`${process.env.API_URL}/api/v2/leads/import`, {
      method: 'POST',

      headers: headers,

      body: JSON.stringify({
        data: leads,
        targets: targets,
        tags: tags,
      }),
    });

    return result;
  }
}

export default new Skorozvon();
