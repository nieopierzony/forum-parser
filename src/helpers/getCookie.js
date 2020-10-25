'use strict';

const { get } = require('axios');

module.exports = async () => {
  // Запрашиваем HTML у сайта
  const res = await get(process.env.FORUM_URL);
  const isSuccess = res && res.status === 200 && res.data;
  if (!isSuccess) throw new Error('Неудачный запрос');

  // Проверяем наличие необходимого куки в странице
  if (!res.data.includes('R3ACTLB')) return null;
  const foundCookie = res.data.split('R3ACTLB=')[1].split(' ;')[0];
  if (!foundCookie) throw new Error('Ошибка при поиске куки на странице');

  return foundCookie;
};
