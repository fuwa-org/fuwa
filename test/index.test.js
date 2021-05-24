const Wrappercord = require('..');

const invertError = (fn) => async () => {
  try {
    await fn();
  } catch {
    return;
  }
  throw new Error("It didn't error.");
};

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
    /*it("shouldn't error when intents of 0 are passed", () => {
      new Wrappercord.Client('my_token', { intents: 0 });
    });*/
  });
  describe('#connect', () => {
    /*it('should work with a valid token', async () => {
      await new Wrappercord.Client(process.env.TOKEN, {
        intents: Wrappercord.Intents.NON_PRIVILEDGED,
      })
        .connect()
        .destroy();
    });*/
    it(
      'should error with an invalid, non-empty token string',
      invertError(() => {
        const client = new Wrappercord.Client('my_token');
        client.connect().then(() => client.destroy());
      })
    );
  });
});
