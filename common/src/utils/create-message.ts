import request from 'supertest';

export const createMsg = (
  title: string,
  expected: string | number,
  response: request.Response
): string => {
  const resTxt = JSON.parse(response.text);
  return `${title}\nexpected: ${expected}, returned: ${response.status.toString()}\n${JSON.stringify(
    resTxt,
    null,
    2
  )}`;
};
