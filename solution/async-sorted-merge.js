'use strict'

const Promise = require('bluebird');
Promise.longStackTraces();

const qqsort = require('qqsort');

module.exports = (logSources, printer) => {
  console.log('--> ==================================================');
  console.log('--> starting async-sorted-merge');
  
  return new Promise((res, rej) => {
    gatherAllLogEntries(logSources, res, rej);
  })
  .then(allEnries => {
    const filteredAr = [];
    allEnries.forEach(itm => {
      if(itm !== false)
        filteredAr.push(itm);
    });
    console.log(` --> filteredAr.length = ${filteredAr.length}`);
    return filteredAr;
  })
  .then(allEntries => {
    console.log(` --> allEntries.length = ${allEntries.length}`);
    //sort them and print them?
    qqsort(allEntries, cmp3, er => {
      allEntries.forEach( sortedEntry => {
        printer.print(sortedEntry);
      });
      console.log('--> We should be done.');
    });
    return true;
  })
  .catch(er => console.error("Error from gatherAllLogEntries", er));
};

// -> promise with all flattened log entries.
let logEntries = [];

function allDone( results ) {
  //We're done if all are false.
  let i = results.length-1;
  do {
    if(results[i] !== false)
      return false;
  }while(i--);
  return true;
}

function commonErrorReporter(er) {
  console.log('[commonErrorReporter] -> ', er);
  throw er;
}

function gatherAllLogEntries( logSources, outerResolve, outerReject ) {
  
  const srcPromise = [];
  
  logSources.forEach((src) => {
    srcPromise.push( src.popAsync().catch(commonErrorReporter) );
  });
  
  //Wait for all to resolve.
  return Promise.all( srcPromise )
    .then((rslt) => {
      //if all rslt indicates done...
      if( allDone(rslt) ) {
        outerResolve(logEntries);
      } else {
        const p = gatherAllLogEntries(logSources, outerResolve, outerReject);
        logEntries = logEntries.concat(rslt);
        return p;
      }
    })
    .catch((er) => {
      console.error("error during gatherAllLogEntries [1]", er);
      outerReject(er);
    });
}

function cmp3(l1,l2) {
  const e1 = l1.date, e2 = l2.date;
  return (e1 < e2) ? -1 : (e1 > e2) ? 1 : 0
}
