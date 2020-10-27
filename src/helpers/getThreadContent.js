'use strict';

const cheerio = require('cheerio');
const htmlToText = require('html-to-text');
const request = require('./request');

module.exports = async id => {
  const threadHTML = await request(`threads/${id}`);
  const $ = cheerio.load(threadHTML.replace(/\t/g, '').replace(/\n/g, ''));
  return htmlToText.fromString($('.bbWrapper').html(), {
    wordwrap: 130,
  });
};
