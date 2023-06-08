import request from 'supertest';

/**
 * This function in meant to display formatted output while testing
 * @param {string} title - Test name can be obtained by calling expect.getState().currentTestName
 * @param {string | number} expected - The expected result
 * @param {string | number} returned - The returned result
 * @param {request.Response} response (Optional) - pass in to format/display what is returned to the client
 */
export const createMsg = (
  title: string,
  expected: string | number,
  returned: string | number,
  response?: request.Response
): string => {
  let resTxt = null;
  if (response && response.text) {
    resTxt = JSON.stringify(JSON.parse(response.text), null, 2);
  }
  const msgPrefix = `${title}\nexpected: ${expected}, returned: ${returned.toString()}`;
  const msgSufix = msgPrefix + resTxt ? resTxt : '';
  return msgPrefix + msgSufix;
};
