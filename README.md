# Satelite Streams

A set of streams that provide and tranform data from [wheretheiss.at/](http://wheretheiss.at/).
###Installation

``git clone https://github.com/nmuldavin/SateliteStreams.git`` then ``npm install``.

###Included Streams

* **SateliteStream**: Provides a readable stream of raw satelite data. Initialize with ``new SateliteStream(options)`` where options is an object specifying a satelite id and request rate in ms:

	```
	const SateliteStream = require('./');
	
	const satStr = new SateliteStream({ rate: 1000, id: 25544 });
	```

* **RateStream**: A transform stream that calculates latitude and longitude rates given a SateliteStream input. Initialize with ``new RateStream``: 

	```
	const satStrs = require('./');
	
	const satStream = new satStrs.SateliteStream({ rate: 1000, id: 25544 });
	const rateStream = new satStrs.RateStream();
	
	satStream.pipe(rateStream);
	```
	
###Demo

For a demo run ``node example.js``.	
	