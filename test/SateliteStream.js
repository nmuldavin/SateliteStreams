const SateliteStream = require('../src/SateliteStream');
const Writable = require('stream').Writable;
const expect = require('chai').expect;

describe('Satelite Stream', () => {
  let satStream;
  let countStream;

  /**
   * Subclasses SateliteStream with overriden call method that increments count
   */
  class FakeSatStream extends SateliteStream {
    constructor(options) {
      super(options);
      this.count = 0;
    }

    // overridden call method
    _getSatInfo() {
      this.count++;
      this.push();
    }
  }

  /**
   * Writeable stream that counts times it receives data
   */
  class CountStream extends Writable {
    constructor() {
      super({ objectMode: true });
      this.count = 0;
    }

    _write(data, encoding, callback) {
      this.count++;
      callback();
    }
  }

  beforeEach((done) => {
    satStream = new FakeSatStream({ rate: 250, id: 25544 });
    countStream = new CountStream();
    satStream.pipe(countStream);
    done();
  });

  afterEach(() => {
    satStream = null;
    countStream = null;
  });

  it('should make calls at the specified rate', (done) => {
    setTimeout(() => {
      expect(satStream.count).to.eql(0);
    }, 200);

    setTimeout(() => {
      expect(satStream.count).to.eql(1);
    }, 300);

    setTimeout(() => {
      expect(satStream.count).to.eql(1);
    }, 450);

    setTimeout(() => {
      expect(satStream.count).to.eql(2);
    }, 550);

    setTimeout(() => {
      expect(satStream.count).to.eql(2);
    }, 700);

    setTimeout(() => {
      expect(satStream.count).to.eql(3);
      done();
    }, 800);
  });

  it('should emit data at specified rate, neglecting call delay', (done) => {
    setTimeout(() => {
      expect(countStream.count).to.eql(0);
    }, 200);

    setTimeout(() => {
      expect(countStream.count).to.eql(1);
    }, 300);

    setTimeout(() => {
      expect(countStream.count).to.eql(1);
    }, 450);

    setTimeout(() => {
      expect(countStream.count).to.eql(2);
    }, 550);

    setTimeout(() => {
      expect(countStream.count).to.eql(2);
    }, 700);

    setTimeout(() => {
      expect(countStream.count).to.eql(3);
      done();
    }, 800);
  });
});
