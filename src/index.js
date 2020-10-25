'use strict';

require('dotenv').config();
const Client = require('./structures/Client');

const client = new Client({
  devs: ['422109629112254464'],
});

client.login(process.env.DISCORD_TOKEN);
client.loadEvents();

module.exports = { client };
