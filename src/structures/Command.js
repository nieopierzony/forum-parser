'use strict';

const AliasPiece = require('./Base/AliasPiece');

class Command extends AliasPiece {
  constructor(store, file, directory, options = {}) {
    super(store, file, directory, options);
    this.name = options.name;
    this.description = options.description;
    this.category = options.category || file.split('/')[0];
    this.clientPermissions =
      options.clientPermissions && options.clientPermissions.length > 0
        ? options.clientPermissions
        : ['SEND_MESSAGES'];
    this.userPermissions =
      options.userPermissions && options.userPermissions.length > 0
        ? options.userPermissions
        : ['SEND_MESSAGES'];

    this.guildOnly = options.guildOnly;
    this.devOnly = options.devOnly;
    this.nsfw = options.nsfw;
  }

  run() {
    throw new Error(`Функция на запуск команды ${this.name} не указана`);
  }
}

module.exports = Command;
