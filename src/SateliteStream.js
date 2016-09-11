const Readable = require('stream').Readable;
const request = require('request');

/**
 * Satelite Stream class
 * @class
 * @extends stream.Readable
 */
class SateliteStream extends Readable {
  /**
   * Satelite Stream constructor
   * @constructor
   * @param {Object} Options object with id and rate
   */
  constructor(options) {
    super({ objectMode: true });
    this.id = options.id;
    this.rate = options.rate;
  }

  /**
   * Makes call to get satelite info
   */
  _getSatInfo() {
    const url = `https://api.wheretheiss.at/v1/satellites/${this.id}`;
    const self = this;

    function handleCallResponse(error, response, body) {
      if (!error && response.statusCode === 200) {
        const info = JSON.parse(body);
        self.push(info);
      }
    }

    request(url, handleCallResponse);
  }
  /**
   * Stream read method
   * executes call after delay specified by rate in ms
   * @override
   */
  _read() {
    setTimeout(() => {
      this._getSatInfo();
    }, this.rate);
  }
}

module.exports = SateliteStream;
