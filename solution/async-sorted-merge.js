'use strict'

const Promise = require('bluebird');
const qqsort = require('qqsort');

module.exports = (logSources, printer) => {
  
  //Gather all Log Entries
  gatherAllLogEntries(logSources)
    .then((allEntries) => {
      console.log('allEntries', allEntries);
      
      //Sort them.
      return new Promise( (res, rej) => {
        qqsort(allEntries, cmp3, (er) => { res(allEntries); });
      }).then(( sortedEntries ) => {
        console.log('qqsort promise then', sortedEntries);
        sortedEntries.forEach( sortedEntry => {
          printer.print(sortedEntry);
        });
      }); //I think this is right.
    })
    //I think print, once the rest of the code is working.
    .then( (o) => { console.log('gatherAllLogEntries - final then', o) } )
    .catch(er => console.error('gatherAllLogEntries - ', er));
  
  
  
}

// promise -> allLogEntries
function gatherAllLogEntries(logSources){
  const sourcePromises = [];
  logSources.forEach( logSource1 => {
    sourcePromises.push( outerGatherLogEntries(logSource1) );
  });
  const entries = [], currentSources = [];
  return Promise.all(sourcePromises)
    .then( (sourceRes) => {
      let r = [];
      sourceRes.forEach( (itm) => { r = r.concat(itm) } );
      return r;
    } )
    .catch( (er) => console.error('gatherAllLogEntries error', er) );
    
    //
    //.then( (result) => [] ); //Eventuall return the list, flattened.
}

function outerGatherLogEntries(logSource) {
  const accumulatedList = [];
  const result = gatherLogEntries(logSource);
  return result;
  
  function gatherLogEntries(logSource) {
    console.log('gatherLogEntries');
    const addToList = (logEntry) => {
      accumulatedList.push(logEntry);
      gatherLogEntries(logSource); //Call recursivly.
    };
    return logSource
      .popAsync()
      .then( addToList )
      .then(() => {
        console.log('returning accumulatedList');
        return accumulatedList;
      })
      .catch( er => { console.error('gatherLogEntries error', er) } );
  }
}



function cmp3(l1,l2) {
  const e1 = l1.date, e2 = l2.date;
  return (e1 < e2) ? -1 : (e1 > e2) ? 1 : 0
}

/*
module.exports = (logSources, printer) => {
  
  const logEntries = [];
  const logEntryPromises = [];
  
  //logSources itself doesn't have anything special inside of it...
  let i = 0;
  function gatherLogEntries(logSource1) {
    i++;
    return logSource1
      .popAsync()
      .then((entry) => {
        if(entry) {
          logEntryPromises.push( gatherLogEntries(logSource1) );
        }
        return entry;
      });
  }
  
  
  logSources.forEach(function(logSource) {
    logEntryPromises.push( gatherLogEntries(logSource) );
    //logSource.popAsync() -> returns a promise that resolves to a log entry or false.
  });
  
  Promise
    .all(logEntryPromises) //Will be lots.
    .then( a => {
      //a would be an array with all of the LogEntries
      console.log(a.length, i);
      console.log(a);
    } );
  
}
*/

/*
alternativly we can do some sort of accumlating alls where each promise ends in a then with the result and the item.
.then( logEntry => { entry: logEntry, logSource: logSource } ) -> then on every all, if we're not all false, do the next "batch>
Batch over and over like that until all resolve to false.
 */