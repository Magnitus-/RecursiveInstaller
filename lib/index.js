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
    var installCmdBase = this.tool === 'yarn' ? 'yarn install' : 'npm install';
    var installCmd = this.installAppend ? installCmdBase + " " + this.installAppend : installCmdBase;
    var options = {'cwd': directory};
    if(this.maxBuffer)
    {
        options['maxBuffer'] = this.maxBuffer;
    }
    installPromises.push(childProcessExec(installCmd, options));
}

function install(directories, options)
{
    installPromises = [];
    
    options = options !== undefined ? options : {};
    var installAppend = options.arguments;
    if(Array.isArray(options.arguments))
    {
        installAppend = options.arguments.reduce((concat, currentArgument) => {
            return concat === null ? currentArgument : concat + " " + currentArgument;
        }, null);
    }
    
    installFunction = npmInstall.bind({'installAppend': installAppend, 'maxBuffer': options.maxBuffer, 'tool': options.tool});
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
