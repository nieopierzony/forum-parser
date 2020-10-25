'use strict';

const AliasStore = require('./Base/AliasStore');
const Command = require('./Command');

class CommandStore extends AliasStore {
  constructor(client) {
    super(client, ['commands', 'команд'], Command);
  }
}

module.exports = CommandStore;
