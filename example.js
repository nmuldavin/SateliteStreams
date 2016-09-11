const satStrs = require('./');
const Transform = require('stream').Transform;
const prettyjson = require('prettyjson');

/**
 * Transform stream to prettyjson print objects
 */
class PrettyJsonStream extends Transform {
  constructor() {
    super({
      writableObjectMode: true,
      readableObjectMode: false,
    });
  }

  _transform(json, encoding, callback) {
    this.push(prettyjson.render(json).concat('\n\n'));
    callback();
  }
}

const satStream = new satStrs.SateliteStream({ rate: 1000, id: 25544 });
const rateStream = new satStrs.RateStream();
const prettyJsonStream = new PrettyJsonStream();

satStream
  .pipe(rateStream)
  .pipe(prettyJsonStream)
  .pipe(process.stdout);
