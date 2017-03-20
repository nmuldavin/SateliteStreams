const SatelliteStream = require('../src/SatelliteStream');
const Writable = require('stream').Writable;
const expect = require('chai').expect;

describe('Satellite Stream', () => {
  let satStream;
  let countStream;

  /**
   * Subclasses SatelliteStream with overriden call method that increments count
   */
  class FakeSatStream extends SatelliteStream {
    constructor(options) {
      super(options);
      this.count = 0;
    }

    // overridden call method
    _getSatInfo() {
      this.count += 1;
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
      this.count += 1;
      callback();
    }
  }

  /**
   * Utility function to assert equality after provided time
   * @param  {Function} getVal Function to get the value you want to check.
   *                           Called at the time of assertion
   * @param  {*} expectedVal Expected Value
   * @param  {Number} time Time in ms at which to make assertion
   */
  const assertEqualityAtTime = (getVal, expectedVal, time) => setTimeout(
    () => expect(getVal()).to.eql(expectedVal),
    time
  );

  /**
   * Array of expected api call / data emission count at a range of times in ms.
   */
  const expectedVals = [
    [0, 200],
    [1, 300],
    [1, 450],
    [2, 550],
    [2, 700],
    [3, 800],
  ];

  beforeEach((done) => {
    /**
     * pipe fake satStream to countstream
     */
    satStream = new FakeSatStream({ rate: 250, id: 25544 });
    countStream = new CountStream();
    satStream.pipe(countStream);
    done();
  });

  afterEach(() => {
    satStream = null;
    countStream = null;
  });

  it('Should make calls at the specified rate', (done) => {
    /**
     * function that returns value of satStream count
     */
    const getCount = () => satStream.count;

    /**
     * Assert that the number of calls made at each time is as expected
     */
    expectedVals.forEach(([val, time]) => assertEqualityAtTime(getCount, val, time));

    /**
     * timeout after 850ms
     */
    setTimeout(done, 850);
  });

  it('Should emit data at specified rate, neglecting call delay', (done) => {
    /**
     * function that returns value of satStream count
     */
    const getCount = () => countStream.count;

    /**
     * Assert that the number of calls made at each time is as expected
     */
    expectedVals.forEach(([val, time]) => assertEqualityAtTime(getCount, val, time));

    /**
     * timeout after 850ms
     */
    setTimeout(done, 850);
  });
});
