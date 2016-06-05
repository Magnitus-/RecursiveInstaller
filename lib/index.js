const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
var actOnModules = require('act-on-modules');
Promise = require('bluebird');

var childProcessExec = Promise.promisify(childProcess.exec, {'multiArgs': true});
var installPromises = [];

function npmInstall(directory)
{
    //console.log('Npm install in directory: ' + directory);
    var installCmd = this.installAppend ? "npm install "+this.installAppend : "npm install";
    installPromises.push(childProcessExec(installCmd, {'cwd': directory}));
}

function install(directories, installAppend)
{
    installPromises = [];
    installFunction = npmInstall.bind({'installAppend': installAppend});
    return new Promise((resolve, reject) => {
        Promise.all(directories.map((directory) => {
            return actOnModules(directory, installFunction);
        })).then(() => {
            return Promise.all(installPromises);
        }).then((results) => {
            results.forEach((result) => {
                console.log(result[0]);
                console.log(result[1]);
            });
            resolve();
        }).catch((err) => {
            reject(err);
        });
    }); 
}

module.exports = install;