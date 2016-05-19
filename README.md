# loopback-sandbox
A repository for reproducing [LoopBack community issues][wiki-issues].
[wiki-issues]: https://github.com/strongloop/loopback/wiki/Reporting-issues

# Github report:
https://github.com/strongloop/loopback-datasource-juggler/issues/936

# Promise.all(dataset.map(model.create)) -> TypeError: this.getDataSource is not a function

I found this pattern at https://github.com/strongloop/loopback/issues/2164#issuecomment-215645590
for using Promise.all() in combination with model.create([]):
```
Promise.all(jobsP.map(Job.create)).then(jobs => {
  console.log('num jobs' + jobs.length);
});
```

I applied that pattern in this snippet to create multiple records for a model with promises:
```
    Promise.all(inputDataSet.map(cl.create))
      .then(results => {
        console.info('num results:' + results.length);
        console.info('results (array of nulls):');
        logger.info(results);
      })
      .catch(function () {
        reject('ERROR Promise.all cli.create() FAILED.');
      });
```

#STR
```
cd ~
git clone https://github.com/pantaluna/loopback-sandbox-this-getdatasource.git
cd loopback-sandbox-this-getdatasource
npm install
node "./bin/01-reproduce.js"
```

consolelog:
> addData()
***The main .catch()***
TypeError: this.getDataSource is not a function
    at DataAccessObject.create (C:\myhtdocs\my-loopback\loopback-sandbox-this-getdatasource\node_modules\loopback-datasource-juggler\lib\dao.js:206:48)
    at Array.map (native)
    at C:\myhtdocs\my-loopback\loopback-sandbox-this-getdatasource\bin\01-add-data-using-promises.js:39:30
    at Promise._execute (C:\myhtdocs\my-loopback\loopback-sandbox-this-getdatasource\node_modules\bluebird\js\release\debuggability.js:272:9)
    at Promise._resolveFromExecutor (C:\myhtdocs\my-loopback\loopback-sandbox-this-getdatasource\node_modules\bluebird\js\release\promise.js:473:18)
    at new Promise (C:\myhtdocs\my-loopback\loopback-sandbox-this-getdatasource\node_modules\bluebird\js\release\promise.js:77:14)
    at addData (C:\myhtdocs\my-loopback\loopback-sandbox-this-getdatasource\bin\01-add-data-using-promises.js:29:10)
    at Object.<anonymous> (C:\myhtdocs\my-loopback\loopback-sandbox-this-getdatasource\bin\01-add-data-using-promises.js:15:15)
    at Module._compile (module.js:541:32)
    at Object.Module._extensions..js (module.js:550:10)
    at Module.load (module.js:456:32)
    at tryModuleLoad (module.js:415:12)
    at Function.Module._load (module.js:407:3)
    at Function.Module.runMain (module.js:575:10)
    at startup (node.js:160:18)
    at node.js:445:3

