/** @format */

const F = require('..');

const s = new F.ShardingManager(process.env.DISCORD_TOKEN, {
  shards: [0, 3],
  mode: 'worker',
  file: './test',
});

s.spawn();
