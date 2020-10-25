'use strict';

const Piece = require('./Piece');

class AliasPiece extends Piece {
  constructor(store, file, directory, options = {}) {
    super(store, file, directory, options);

    this.aliases = options.aliases || [];
  }
}

module.exports = AliasPiece;
