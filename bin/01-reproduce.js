var Promise = require('bluebird');
var path = require('path');

// Float unhandled Promises in Node.js
// http://stackoverflow.com/questions/28709666/how-do-i-handle-exceptions-globally-with-native-promises-in-io-js-node-js
process.on("unhandledRejection", function(reason, p){
  console.log("unhandledRejection ", reason, p); // log all your errors, "floating" them.
  throw reason; // OPTIONAL in case you want to treat these as errors
});

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
  .catch(function (err) {
    console.error('***The main .catch()***');
    console.error(err);
  })
  .then(function () {
    console.info('> EXIT. Stopping Loopback so the Node.js main process exits a well...');
    app.close();
    setTimeout(process.exit(), 1000);
  });

function addData() {
  return new Promise(function (resolve, reject) {
    console.info('> addData()');

    let cl = app.models.Checklist;
    let inputDataSet = [
      {description: 'Promise #1: ONLY the description field is specified'},
      {description: 'Promise #2: ONLY the description field is specified'},
      {description: 'Promise #3: ONLY the description field is specified'}
    ];

    Promise.all(inputDataSet.map(cl.create))
      .then(results => {
        console.info('num results:' + results.length);
        console.info('results (array of nulls):');
        console.info(results);
        resolve(results);
      })
      .catch(function (err) {
        console.error('ERROR Promise.all cli.create() FAILED.');
        reject(err);
      });
/*
    Promise.mapSeries(inputDataSet, function (data) {
        return cl.create(data);
      })
      .then(results => {
         console.info('num results:' + results.length);
         console.info('results');
         console.info(results);
         // Promise management!
         resolve(results);
      })
      .catch(function (error) {
        console.error('ERROR Promise.mapSeries cl.create() FAILED.');
        reject(error);
      });
*/

  });
}
