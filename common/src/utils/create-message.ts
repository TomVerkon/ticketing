import request from 'supertest';

/**
 * This function in meant to display formatted output while testing
 * @param {string} title - Test name can be obtained by calling expect.getState().currentTestName
 * @param {string | number} expected - The expected result
 * @param {string | number} actual - The actual result
 * @param {string} response? - pass response.text in to format/display what is returned to the client
 */
export const createMsg = (
  title: string,
  expected: string | number,
  actual: string | number,
  response?: string
): string => {
  const msgPrefix = `${title}\nexpected: ${expected.toString()}, returned: ${actual.toString()}`;
  let msgSuffix = '';
  if (response) {
    msgSuffix = `\n${JSON.stringify(JSON.parse(response), null, 2)}`;
  }
  return `${msgPrefix}${msgSuffix}`;
};
