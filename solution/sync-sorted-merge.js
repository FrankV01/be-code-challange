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
	//   BUT you do know that the entries within each source are sorted chronologically (that last bit is important).

  // HOWEVER, we still must merge the different log entries prior to output.
  
  const logEntries = [];
  
  //console.log(logSources);
  console.log('=================================================================');
  let i = 0;
  logSources.forEach( logSource => {
    let logEntry = logSource.pop(); //Returned in order
    do {
      //{ date: <date>, msg: <str> }
      logEntries.push(logEntry);
      i++;
    } while( logEntry = logSource.pop() );
    console.log(`${i} ----------------------------------------------------------`);
  } );
  
  console.log(`${i} - starting sort and output`);
  qqsort(logEntries, cmp3, (er) => {
    logEntries.forEach( sortedEntry => {
      printer.print(sortedEntry);
    } );
    console.log(`${logEntries.length} log entries processed`);
  });
}

function cmp2(l1, l2) {
	const e1 = l1.last.date, e2 = l2.last.date;
	return (e1 < e2) ? -1 : (e1 > e2) ? 1 : 0
}
function cmp3(l1,l2) {
  const e1 = l1.date, e2 = l2.date;
  return (e1 < e2) ? -1 : (e1 > e2) ? 1 : 0
}