const { Client } = require("../dist/client");
try {
  // @ts-expect-error
  new Client();
  console.log("oh no test failed");
} catch {}
try {
  // @ts-expect-error
  new Client("");
  console.log("oh no test failed");
} catch {}
try {
  // @ts-expect-error
  new Client("", {});
  console.log("oh no test failed");
} catch {}

const client = new Client("", { intents: 1 });
client.connect();
