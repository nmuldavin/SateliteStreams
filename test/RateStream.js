const RateStream = require('../src/RateStream');
const Writable = require('stream').Writable;
const expect = require('chai').expect;

describe('Rate Stream', () => {
  let rateStream;
  let saveStream;
  /**
   * Writable stream that saves most recent data it receives;
   */
  class SaveLastDataStream extends Writable {
    constructor() {
      super({ objectMode: true });
      this.data = null;
    }

    _write(data, encoding, callback) {
      this.data = data;
      callback();
    }
  }

  const first = {
    name: 'iss',
    id: 25544,
    latitude: 43.66895401044,
    longitude: 140.14626711827,
    timestamp: 1473615266,
  };

  const second = {
    name: 'iss',
    id: 25544,
    latitude: 43.702494859098,
    longitude: 140.21856054143,
    timestamp: 1473615267,
  };

  const result = {
    name: 'iss',
    id: 25544,
    latRate: 0.03354084865800644,
    lonRate: 0.07229342316000498,
    timestamp: 1473615267,
  };

  beforeEach((done) => {
    rateStream = new RateStream();
    saveStream = new SaveLastDataStream();
    rateStream.pipe(saveStream);
    done();
  });

  afterEach(() => {
    rateStream = null;
    saveStream = null;
  });

  it('Should emit rate only after receiving data twice', () => {
    rateStream.write(first);
    expect(saveStream.data).to.eql(null);
  });

  it('Should calculate rates correctly', (done) => {
    rateStream.write(first);
    rateStream.write(second);
    expect(saveStream.data).to.eql(result);

    done();
  });
});
