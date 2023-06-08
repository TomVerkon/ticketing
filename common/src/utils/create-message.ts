import request from 'supertest';

/**
 * This function in meant to display formatted output while testing
 * @param {string} title - Test name can be obtained by calling expect.getState().currentTestName
 * @param {string | number} expected - The expected result
 * @param {string | number} returned - The returned result
 * @param {string} response? - pass response.text in to format/display what is returned to the client
 */
export const createMsg = (
  title: string,
  expected: string | number,
  returned: string | number,
  response?: string
): string => {
  let resTxt = null;
  if (response) {
    resTxt = JSON.stringify(JSON.parse(response), null, 2);
  }
  const msgPrefix = `${title}\nexpected: ${expected}, returned: ${returned.toString()}`;
  const msgSufix = msgPrefix + resTxt ? resTxt : '';
  return msgPrefix + msgSufix;
};
