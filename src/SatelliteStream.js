const Readable = require('stream').Readable;
const request = require('request');

/**
 * Satellite Stream class
 * @class
 * @extends stream.Readable
 */
class SatelliteStream extends Readable {
  /**
   * Satellite Stream constructor
   * @constructor
   * @param {Object} Options object with id and rate
   */
  constructor(options) {
    super({ objectMode: true });
    this.id = options.id;
    this.rate = options.rate;
  }

  /**
   * Makes call to get satellite info
   */
  _getSatInfo() {
    const url = `https://api.wheretheiss.at/v1/satellites/${this.id}`;

    const handleCallResponse = (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const info = JSON.parse(body);
        this.push(info);
      }
    };

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

module.exports = SatelliteStream;
