'use strict';

const { readdirSync } = require('fs');
const { join } = require('path');

const { Client, Collection } = require('discord.js');
const CommandStore = require('./CommandStore');

module.exports = class AdvancedClient extends Client {
  constructor(options) {
    super();
    this.developers = options.devs;
    this.prefix = options.prefix || '/';

    this.stores = new Collection();
    this.commands = new CommandStore(this);

    this.registerStore(this.commands);

    const pieceDirectory = join(__dirname, '../');
    for (const store of this.stores.values()) store.registerPieceDirectory(pieceDirectory);

    console.log(`[Client] Начинается авторизация клиента`);
  }

  registerStore(store) {
    this.stores.set(store.names[0], store);
    return this;
  }

  async login(token) {
    const loaded = await Promise.all(
      this.stores.map(async store => `[Loader] Загружено ${await store.loadAll()} ${store.names[1]}.`),
    ).catch(err => {
      console.error(err);
      process.exit();
    });
    console.log(loaded.join('\n'));
    super.login(token);
    return this;
  }

  loadEvents() {
    console.log(`\n[Events] Начинается загрузка событий`);

    const files = readdirSync('./src/events').filter(name => name.endsWith('.js'));
    let total = 0;

    files.forEach(file => {
      const event = require(`../events/${file}`);
      const eventName = file.split('.js')[0];
      this.on(eventName, event.bind(null, this));
      total++;

      console.log(`[Events] Событие ${eventName} успешно загружено`);
    });

    console.log(`[Events] Загружено событий: ${total}\n`);
    return this;
  }

  // Является ли пользователь разработчиком
  isDev(id) {
    return this.developers.includes(id);
  }
};
