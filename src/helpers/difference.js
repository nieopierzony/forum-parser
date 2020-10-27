'use strict';

module.exports = (arr1, arr2) => {
  const diff = [];
  arr2.forEach(el => {
    if (!arr1.find(i => i.id === el.id)) diff.push(el);
  });
  return diff;
};
