'use strict'

var qqsort = require('qqsort');

/*
var data = [{a:2}, {a:3}, {a:1}, {a:4}]
qqsort(data, function(a,b) { return a.a - b.a }, function(err) {
    // data => [{a:1}, {a:2}, {a:3}, {a:4}]
})
*/

//Your mission is to print out all of the entries, across all of the sources, in chronological order.
// "print the sorted merge of all LogEntries across `n` LogSources."
module.exports = (logSources, printer) => {
	//We have logSource and within there each is sorted

	//BUT you do know that the entries within each source are sorted chronologically (that last bit is important).

	//how many logSources are there.
	console.log(` --> there are ${logSources.length} sources`);



	console.log(logSources);
	console.log('=================================================================');
	let i = 0;
	logSources.forEach( logSource => {
		let logEntry = logSource.pop(); //Returned in order
		do {
			//{ date: <date>, msg: <str> }
			printer.print(logEntry);
			i++;
		} while( logEntry = logSource.pop() );
		console.log(`${i} ----------------------------------------------------------`);
	} );

	//console.log( logSources.pop() );

	// [ {}, {} ]
	// Sorts in place
	// qqsort(logSources, cmp2, function( er ) {
	// 	if(er) {
	// 		console.error(er);
	// 	} else {
	// 		//At this point it (seems) sorted.
	// 		logSources.forEach( logs => {
	// 			printer.print(logs.last);
	// 		} );
	// 	}
	// });
}

function cmp2(l1, l2) {
	const e1 = l1.last.date, e2 = l2.last.date;
	return (e1 < e2) ? -1 : (e1 > e2) ? 1 : 0
}
