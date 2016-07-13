const recursiveInstaller = require('../lib/index');
const path = require('path');
const fs = require('fs');

const childProcess = require('child_process');
const actOnModules = require('act-on-modules');

exports.test = {
    'tearDown': function(callback) {
        callback();
    },
    'basic_functionality': function(test) {
        test.expect(1);
        recursiveInstaller([path.join(__dirname, 'app'), path.join(__dirname, 'shared')], null, 1024 * 500).then(() => {
            try
            {
                fs.accessSync(path.join(__dirname, 'app', 'node_modules'), fs.F_OK);
                fs.accessSync(path.join(__dirname, 'shared', 'user-store', 'node_modules'), fs.F_OK);
                fs.accessSync(path.join(__dirname, 'shared', 'array', 'capitalize-array', 'node_modules'), fs.F_OK);
                fs.accessSync(path.join(__dirname, 'shared', 'array', 'sort-array', 'node_modules'), fs.F_OK);
                test.ok(true, 'Ensuring that all modules got their dependencies installed properly');
            }
            catch(err)
            {
                console.log(err);
            }
        }).then(() => {
            actOnModules.sync(path.join(__dirname, 'app'), (directory) => {
                childProcess.execSync('rm -R node_modules', {'cwd': directory});
            });
            actOnModules.sync(path.join(__dirname, 'shared'), (directory) => {
                childProcess.execSync('rm -R node_modules', {'cwd': directory});
            });
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            test.done();
        });
    },
    'explicitInstalls': function(test) {
        test.expect(2);
        recursiveInstaller([path.join(__dirname, 'explicitInstalls')], null, 1024 * 500).then(() => {
            return Promise.all([recursiveInstaller([path.join(__dirname, 'explicitInstalls', 'prod')], '--production', 1024 * 500, true),
                                recursiveInstaller([path.join(__dirname, 'explicitInstalls', 'dev')], null, 1024 * 500, true)]);
        }).then(() => {
            try
            {
                fs.accessSync(path.join(__dirname, 'explicitInstalls', 'prod', 'node_modules', 'hapi'), fs.F_OK);
                fs.accessSync(path.join(__dirname, 'explicitInstalls', 'prod', 'node_modules', 'joi'), fs.F_OK);
                fs.accessSync(path.join(__dirname, 'explicitInstalls', 'prod', 'node_modules', 'boom'), fs.F_OK);
                fs.accessSync(path.join(__dirname, 'explicitInstalls', 'prod', 'node_modules', 'bluebird'), fs.F_OK);
                fs.accessSync(path.join(__dirname, 'explicitInstalls', 'dev', 'node_modules', 'hapi'), fs.F_OK);
                fs.accessSync(path.join(__dirname, 'explicitInstalls', 'dev', 'node_modules', 'joi'), fs.F_OK);
                fs.accessSync(path.join(__dirname, 'explicitInstalls', 'dev', 'node_modules', 'boom'), fs.F_OK);
                fs.accessSync(path.join(__dirname, 'explicitInstalls', 'dev', 'node_modules', 'bluebird'), fs.F_OK);
                fs.accessSync(path.join(__dirname, 'explicitInstalls', 'dev', 'node_modules', 'nodeunit'), fs.F_OK);
                test.ok(true, 'Ensuring that all modules that should be there are there');
            }
            catch(err)
            {
                console.log(err);
            }
        }).then(() => {
            var ok1, ok2, ok3;
            try
            {
                fs.accessSync(path.join(__dirname, 'explicitInstalls', 'prod', 'node_modules', 'nodeunit'), fs.F_OK);
            }
            catch(err)
            {
                ok1 = true;
            }
            try
            {
                fs.accessSync(path.join(__dirname, 'explicitInstalls', 'prod', 'node_modules', 'mongodb'), fs.F_OK);
            }
            catch(err)
            {
                ok2 = true;
            }
            try
            {
                fs.accessSync(path.join(__dirname, 'explicitInstalls', 'dev', 'node_modules', 'mongodb'), fs.F_OK);
            }
            catch(err)
            {
                ok3 = true;
            }
            test.ok(ok1 && ok2 && ok3, 'Ensuring that all modules that should not be there are not there');
        }).then(() => {
            /*actOnModules.sync(path.join(__dirname, 'explicitInstalls', 'prod'), (directory) => {
                childProcess.execSync('rm -R node_modules', {'cwd': directory});
            });
            actOnModules.sync(path.join(__dirname, 'explicitInstalls', 'dev'), (directory) => {
                childProcess.execSync('rm -R node_modules', {'cwd': directory});
            });*/
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            test.done();
        });
    }
};

