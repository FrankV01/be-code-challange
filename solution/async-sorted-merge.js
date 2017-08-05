'use strict'

const Promise = require('bluebird');

module.exports = (logSources, printer) => {
  
  const logEntries = []; //-> array of promises
  
  //console.log(logSources);
  console.log('=====async-sorted-merge============================================================');
  let i = 0;
  
  logSources.forEach( logSource => {
  	// popAsync returns a promise and resolves to a single log entry.
		//  We need to gather all of the log entries in the logSource
		//  which means we need to call popAsync as long as there are more entries
    //logEntries.push( logSource.popAsync() ); //This only gets the first though, right?
  
    //logSource
    //  .popAsync() //-> a promise with either false or logEntry
			//We don't know if there is more until after it resolves.
		
		function handleResults(logEntry) {
      const src = logSource;
      if(logEntry) {
        logEntries.push(logEntry);
      	return src.popAsync().then(handleResults);
      }
		}
		
		logSource.popAsync().then( handleResults );
		
		
		
		// --------------
		
		function handleResult( logEntry ) {
			if(!logEntry) {
        logEntries.push(logEntry); //Insert
        logSource.popAsync().then(handleResult);
			}
			//Otherwise done
		}
		
		logSource
			.popAsync()
			.then( handleResult );
		
  	/*
    let logEntry = logSource.pop(); //Returned in order
    do {
      //{ date: <date>, msg: <str> }
      logEntries.push(logEntry);
      i++;
    } while( logEntry = logSource.pop() );
    console.log(`${i} ----------------------------------------------------------`);
    */
  } );
	
  // Promise
		// .all( logEntries )
		// .then( entries => { //expect an array of resolved promises.
  //     // entries[0]
		// 		// .popAsync() //not a function.
		// 		// .then(result1 => {
		// 		// 	console.log(result1)
		// 		// });
		// 	console.log(entries)
		// } );
}