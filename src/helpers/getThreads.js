'use strict';

const cheerio = require('cheerio');
const request = require('./request');

module.exports = async (forum, page = 1) => {
  const forumHTML = await request(`forums/${forum}/page-${page}`);
  const $ = cheerio.load(forumHTML.replace(/\t/g, '').replace(/\n/g, ''));

  const threads = [];

  $('.structItem').each((i, el) => {
    const mainDiv = el.children.find(c => c.attribs.class.includes('structItem-cell--main'));
    const isSticky =
      mainDiv.children[0].attribs.class === 'structItem-statuses' &&
      mainDiv.children[0].children.some(j =>
        j.children.find(i => i.children && i.children.find(l => l.data === 'Закреплено')),
      );

    const authorNick = mainDiv.parent.attribs['data-author'];
    const authorID = el.children[0].children[0].children[0].attribs['data-user-id'];

    const titleDiv = mainDiv.children
      .find(j => j.attribs.class.includes('structItem-title'))
      .children.find(j => !j.attribs.class.includes('labelLink'));

    const title = titleDiv.children[0].data;
    const id = titleDiv.attribs.href.split('threads/')[1].split('/')[0];

    const createDate = mainDiv.children
      .find(j => j.attribs.class.includes('structItem-minor'))
      .children[0].children.find(j => j.attribs.class && j.attribs.class.includes('structItem-startDate')).children[0]
      .children[0].attribs['data-time'];

    threads.push({ id, title, author: { nick: authorNick, id: authorID }, createDate, isSticky });
  });

  return threads;
};
