const Transform = require('stream').Transform;

/**
 * Rate Stream class
 * @class
 * @extends stream.Transform
 */
class RateStream extends Transform {
  /**
   * Rate stream constructor
   * @constructor
   */
  constructor() {
    super({
      writableObjectMode: true,
      readableObjectMode: true,
    });
  }

  /**
   * Stream transform method
   * Calculates lat and lon rates from previous data and current
   * @override
   */
  _transform(data, encoding, callback) {
    // if no previous data, save and return
    if (!this.previousData) {
      this.previousData = data;
      callback();
    } else {
      // calculate and push
      const latDiff = data.latitude - this.previousData.latitude;
      const lonDiff = data.longitude - this.previousData.longitude;
      const timeDiff = data.timestamp - this.previousData.timestamp;

      this.previousData = data;

      this.push({
        name: data.name,
        id: data.id,
        timestamp: data.timestamp,
        latRate: latDiff / timeDiff,
        lonRate: lonDiff / timeDiff,
      });

      callback();
    }
  }
}

module.exports = RateStream;
