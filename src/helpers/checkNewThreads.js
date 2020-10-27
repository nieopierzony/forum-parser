'use strict';

const difference = require('./difference');
const getThreads = require('./getThreads');

module.exports = async (client, forum) => {
  const newThreadList = (await getThreads(forum, 4)).filter(el => !el.isSticky && !el.answers);

  // Если кеш пуст, заполняем новой информацией и выходим
  if (!client.threads) return (client.threads = newThreadList);

  // Сверяем кеш и свежий список тем
  const diff = difference(client.threads, newThreadList);

  if (diff.length !== 0) {
    // Создаем новый ивент для каждой новой темы
    diff.forEach(i => client.emit('threadCreate', i));
  }

  return (client.threads = newThreadList);
};
