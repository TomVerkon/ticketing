import request from 'supertest';

export const createMsg = (
  title: string,
  expected: string | number,
  returned: string | number,
  response?: request.Response
): string => {
  let resTxt = '';
  if (response && response.text) {
    resTxt = JSON.parse(response.text);
  }
  return `${title}\nexpected: ${expected}, returned: ${returned.toString()}\n${JSON.stringify(
    resTxt,
    null,
    2
  )}`;
};
