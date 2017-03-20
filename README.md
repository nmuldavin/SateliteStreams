# Satellite Streams

A set of streams that provide and transform data from [wheretheiss.at/](http://wheretheiss.at/).
###Installation

``git clone https://github.com/nmuldavin/SatelliteStreams.git`` then ``npm install``.

###Included Streams

* **SatelliteStream**: Provides a readable stream of raw satellite data. Initialize with ``new SatelliteStream(options)`` where options is an object specifying a satellite id and request rate in ms:

	```
	const SatelliteStream = require('./');

	const satStr = new SatelliteStream({ rate: 1000, id: 25544 });
	```

* **RateStream**: A transform stream that calculates latitude and longitude rates given a SatelliteStream input. Initialize with ``new RateStream()``:

	```
	const satStrs = require('./');

	const satStream = new satStrs.SatelliteStream({ rate: 1000, id: 25544 });
	const rateStream = new satStrs.RateStream();

	satStream.pipe(rateStream);
	```

###Demo

For a demo run ``node example``.
