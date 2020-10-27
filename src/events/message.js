'use strict';

const allowedGuilds = ['717206305374470155'];

module.exports = (client, message) => {
  // Если это бот, выходим
  if (message.author.bot || message.system) return;

  // Проверяем сервер
  if (!message.guild || !allowedGuilds.includes(message.guild.id)) return;

  // Является ли сообщение командой?
  if (!message.content.startsWith('/')) return;

  // Заменяем массовые упоминания на обычный текст
  message.content = message.content.replace(/@everyone/g, '**everyone**');
  message.content = message.content.replace(/@here/g, '**here**');

  // Делим сообщение на аргументы, убирая пробелы между словами. Получаем массив
  const args = message.content.slice(1).trim().split(/ +/g);

  // Находим команду в базе данных
  const cmdName = args[0].toLowerCase().normalize();
  args.shift();

  const cmd = client.commands.find(c => c.name === cmdName || (c.aliases && c.aliases.includes(cmdName)) || null);

  // Если команда есть в БД
  if (cmd) {
    // Если команда только для разработчиков, а у автора нет прав, дать ошибку
    if (!client.isDev(message.author.id) && (['dev'].includes(cmd.category) || cmd.devOnly)) return;
    // Логируем использование команды
    console.log(
      `[Message] ${message.author.tag} использовал команду ${cmd.name} ${
        message.guild ? `на сервере ${message.guild.name} в канале ${message.channel.name}` : `в личных сообщениях`
      }`,
    );

    // Запускаем команду
    cmd.run({ client, message, args });
  }
};
