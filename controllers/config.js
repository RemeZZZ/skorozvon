import { getVtbConfig } from '../store/index.js';

export async function vtbConfig(request, response) {
  response.send(getVtbConfig());
}
