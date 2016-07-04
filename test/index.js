const recursiveInstaller = require('../lib/index');
const path = require('path');
const fs = require('fs');

const childProcess = require('child_process');
const actOnModules = require('act-on-modules');

exports.test = {
    'tearDown': function(callback) {
        actOnModules.sync(path.join(__dirname, 'app'), (directory) => {
            childProcess.execSync('rm -R node_modules', {'cwd': directory});
        });
        actOnModules.sync(path.join(__dirname, 'shared'), (directory) => {
            childProcess.execSync('rm -R node_modules', {'cwd': directory});
        });
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
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            test.done();
        });
    }
};

