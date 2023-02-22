import Skorozvon from '../utils/Skorozvon.js';

export async function getOperators(request, response) {
  const operators = await Skorozvon.getOperators();

  response.send(operators);
}
