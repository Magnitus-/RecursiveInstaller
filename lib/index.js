const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
var actOnModules = require('act-on-modules');
Promise = require('bluebird');

var childProcessExec = Promise.promisify(childProcess.exec, {'multiArgs': true});
var installPromises = [];

function npmInstall(directory)
{
    var options = {'cwd': directory};
    if(this.maxBuffer)
    {
        options['maxBuffer'] = this.maxBuffer;
    }
    
    if(!this.explicitInstalls)
    {
        var installCmd = this.installAppend ? "npm install "+this.installAppend : "npm install";
        installPromises.push(childProcessExec(installCmd, options));
    }
    else
    {
        var package = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));
        Object.keys(package.dependencies).forEach((dependency) => {
            installPromises.push(childProcessExec("npm install " + dependency + "@\"" + package.dependencies[dependency] + "\"", options));
        });
        if(this.installAppend != '--production')
        {
            Object.keys(package.devDependencies).forEach((dependency) => {
                installPromises.push(childProcessExec("npm install " + dependency + "@\"" + package.devDependencies[dependency] + "\"", options));
            });
        }
    }
}

function install(directories, installAppend, maxBuffer, explicitInstalls)
{
    installPromises = [];
    installFunction = npmInstall.bind({'installAppend': installAppend, 'maxBuffer': maxBuffer, 'explicitInstalls': explicitInstalls});
    return new Promise((resolve, reject) => {
        Promise.all(directories.map((directory) => {
            return actOnModules(directory, installFunction);
        })).then(() => {
            if(installPromises.length > 0)
            {
                return Promise.all(installPromises);
            }
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
