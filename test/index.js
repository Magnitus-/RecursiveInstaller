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
    'basic_functionality_npm': function(test) {
        test.expect(1);
        recursiveInstaller([path.join(__dirname, 'app'), path.join(__dirname, 'shared')], {'maxBuffer': 1024*1024*5}).then(() => {
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
    },
    'basic_functionality_yarn': function(test) {
        test.expect(2);
        var exceptions = 0;
        recursiveInstaller([path.join(__dirname, 'app'), path.join(__dirname, 'shared')], {'tool': 'yarn', 'maxBuffer': 1024*1024*5, 'arguments': '--no-lockfile'}).then(() => {
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
            return Promise.all([
                new Promise((resolve, reject) => {    
                    try {
                        fs.accessSync(path.join(__dirname, 'app', 'yarn.lock'), fs.F_OK);
                        resolve();
                    } catch(err) {
                        exceptions++;
                        resolve();
                    }
                }),
                new Promise((resolve, reject) => {    
                    try {
                        fs.accessSync(path.join(__dirname, 'shared', 'user-store', 'yarn.lock'), fs.F_OK);
                        resolve();
                    } catch(err) {
                        exceptions++;
                        resolve();
                    }
                }),
                new Promise((resolve, reject) => {    
                    try {
                        fs.accessSync(path.join(__dirname, 'shared', 'array', 'capitalize-array', 'yarn.lock'), fs.F_OK);
                        resolve();
                    } catch(err) {
                        exceptions++;
                        resolve();
                    }
                }),
                new Promise((resolve, reject) => {    
                    try {
                        fs.accessSync(path.join(__dirname, 'shared', 'array', 'sort-array', 'yarn.lock'), fs.F_OK);
                        resolve();
                    } catch(err) {
                        exceptions++;
                        resolve();
                    }
                })
            ]);
        }).then(() => {
            test.ok(exceptions === 4, "Ensure that argument to not generate lock files was properly passed")
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            test.done();
        });
    }
};

