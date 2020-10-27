'use strict';

const { MessageEmbed, Util } = require('discord.js');
const { escapeMarkdown } = Util;
const getContent = require('../helpers/getThreadContent');

module.exports = async (client, thread) => {
  // Проверка наличия сервера и канала для отправки сообщения
  const guild = client.guilds.cache.get('470981734863994881');
  if (!guild) throw new Error('Сервер не найден');

  const channel = guild.channels.cache.get('505846942949965844');
  if (!channel) throw new Error('Канал не найден');

  try {
    // Парсинг контента темы
    const content = await getContent(thread.id);

    const rightForm = checkForm(content);
    const adminNick = getAdminNick(content);
    const authorNick = getAuthorNick(content);

    // Создание описания по полученным данным
    const description = [];

    if (rightForm) description.push('Тема соответствует форме.');
    else description.push('Проверка на форму не пройдена.');

    if (adminNick) description.push('Ник администратора был найден.');
    else description.push('Ник администратора не найден.');

    if (authorNick) description.push('Ник автора темы найден.');
    else description.push('Ник автора темы не был найден.');

    description.push(`\n[Перейти к жалобе](${threadURL(thread.id)})`);

    // Отправка сообщения о новой теме в канал
    await channel.send(
      new MessageEmbed()
        .setColor(rightForm ? '#88f071' : '#ff7773')
        .setDescription(`**${description.join(' ')}**`)
        .setTitle(`**${escapeMarkdown(thread.title)}**`)
        .setURL(threadURL(thread.id))
        .addField(
          '**Автор темы**',
          `**[${authorNick ? escapeMarkdown(authorNick) : escapeMarkdown(thread.author.nick)}](${userURL(
            thread.author.id,
          )})**`,
          true,
        )
        .addField('**Администратор**', adminNick ? `**${escapeMarkdown(adminNick)}**` : '**Не найдено**', true)
        .addField(
          '**Суть жалобы**',
          `**\`\`\`${escapeMarkdown(`${content.substring(0, 200)}...`, {
            inlineCode: false,
            italic: false,
          })}\`\`\`**`,
        ),
    );
  } catch (err) {
    console.error(err);
  }
};

// Тут идет однотонный код
// Надо придумать, как можно оптимизировать эти функции

function userURL(id) {
  return `${process.env.FORUM_URL}members/${id}`;
}

function threadURL(id) {
  return `${process.env.FORUM_URL}threads/${id}`;
}

function getAdminNick(content) {
  const matchedContent = [...content.matchAll(/[ник|имя] администратора ?(:?)+[ |]?([a-zA-Z]+[ |_][a-zA-Z]+)/gim)];
  return matchedContent && matchedContent[0] && matchedContent[0][2] ? matchedContent[0][2] : null;
}

function getAuthorNick(content) {
  const matchedContent = [...content.matchAll(/игровой ник ?(:?)+[ |]?([a-zA-Z]+[ |_][a-zA-Z]+)/gim)];
  return matchedContent && matchedContent[0] && matchedContent[0][2] ? matchedContent[0][2] : null;
}

const requiredPhrases = ['игровой ник', 'ник администратора', 'суть жалобы'];
function checkForm(content) {
  const lowerCaseContent = content.toLowerCase();
  return requiredPhrases.every(i => lowerCaseContent.includes(i));
}
