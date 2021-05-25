const { expect } = require('chai');
const Wrappercord = require('..');
process.env.TOKEN = require('fs')
  .readFileSync(require('path').join(__dirname, '..', '.env'))
  .slice(6, -1);
const invertError = (fn) => async () => {
  try {
    await fn();
  } catch {
    return;
  }
  throw new Error("It didn't error.");
};
it('user should have specified a token', () => {
  if (!process.env.TOKEN) throw new Error();
});
describe('Client', () => {
  describe('.constructor', () => {
    it(
      'should error if no parameters are passed',
      invertError(() => {
        new Wrappercord.Client();
      })
    );
    it(
      'should error when an empty string is provided as a token',
      invertError(() => {
        new Wrappercord.Client('');
      })
    );
    it(
      'should error when no intents are passed',
      invertError(() => {
        new Wrappercord.Client('my_token', {});
      })
    );
    // FIXME
    it("shouldn't error when intents of 0 are passed", () => {
      new Wrappercord.Client('my_token', { intents: 0 });
    });
  });
  describe('#connect', async () => {
    const client = new Wrappercord.Client(process.env.TOKEN, {
      intents: Wrappercord.Intents.NON_PRIVILEDGED,
    });
    it('should work with a valid token', async () => {
      await client.connect();
    });
    it('should destroy properly', () => {
      client.destroy();
      if (client.ws.socket || client.token || client.user) throw new Error();
    });
    it(
      'should error with an invalid, non-empty token string',
      invertError(() => {
        const client = new Wrappercord.Client('my_token');
        client.connect();
      })
    );
  });
});
