var Promise = require('bluebird');
var path = require('path');

// Loopback bootstrap in my independent script :)
var app = require(path.resolve(__dirname, '../server/server'));

// app: inject close logic
app.close = function () {
  app.removeAllListeners('started');
  app.removeAllListeners('loaded');
};

//
// MAIN promise chaining
let promise = addData();
promise
  .then(function () {
    console.info('> EXIT. Stopping Loopback so the Node.js main process exits a well...');
    app.close();
    setTimeout(process.exit(), 1000);
  })
  .catch(function (err) {
    console.error('***The main .catch()***');
    console.error(err);
  });


function addData() {
  return new Promise(function (resolve, reject) {
    console.info('> addData()');

    let cl = app.models.Checklist;
    let inputDataSet = [
      {description: 'Promise #1: ONLY the description field is specified'},
      {description: 'Promise #2: ONLY the description field is specified'},
      {description: 'Promise #3: ONLY the description field is specified'},
    ];

    Promise.all(inputDataSet.map(cl.create))
      .then(results => {
        console.info('num results:' + results.length);
        console.info('results (array of nulls):');
        logger.info(results);
      })
      .catch(function () {
        throw new Error('ERROR Promise.all cli.create() FAILED.');
      });

    /*
     Promise.mapSeries(inputDataSet, function(data) {
     return cl.create(data);
     })
     .then(results => {
     logger.info('num results:' + results.length);
     logger.info('results'); logger.info(results);
     // Promise management!
     resolve();
     })
     .catch(function (error) {
     throw new Error('ERROR Promise.mapSeries cl.create() FAILED.');
     });
     */


  });
}
