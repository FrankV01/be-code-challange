'use strict'

const Promise = require('bluebird');
const qqsort = require('qqsort');

module.exports = (logSources, printer) => {
  
  
  gatherAllLogEntries(logSources)
    .then(allEntries => {
      console.log(allEntries)
    })
    .catch(er => console.error("Error from gatherAllLogEntries", er));
  
}

// -> promise with all flattened log entries.
let logEntries = [];

// function collect( rslt ) {
//   logEntries.concat(rslt);
// }

function allDone( results ) {
  //We're done if all are false.
  let i = results.length-1;
  do {
    if(results[i] !== false)
      return false;
  }while(i--);
  return true;
}

function gatherAllLogEntries( logSources ) {
  
  return new Promise((res, rej) => {
    const srcPromise = [];
  
    logSources.forEach((src) => {
      srcPromise.push( src.popAsync() );
    });
  
    //Wait for all to resolve.
    Promise.all( srcPromise )
      .then((rslt) => {
        //if all rslt indicates done...
        if( allDone(rslt) ) {
          res(logEntries);
        } else {
          gatherAllLogEntries(logSources);
          logEntries = logEntries.concat(rslt);
        }
      })
      .catch( (er) => { rej(er); } );
  });
}



function cmp3(l1,l2) {
  const e1 = l1.date, e2 = l2.date;
  return (e1 < e2) ? -1 : (e1 > e2) ? 1 : 0
}


/*
alternativly we can do some sort of accumlating alls where each promise ends in a then with the result and the item.
.then( logEntry => { entry: logEntry, logSource: logSource } ) -> then on every all, if we're not all false, do the next "batch>
Batch over and over like that until all resolve to false.
 */