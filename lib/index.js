const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
var actOnModules = require('act-on-modules');
Promise = require('bluebird');

var childProcessExec = Promise.promisify(childProcess.exec, {'multiArgs': true});
var installPromises = [];

function npmLockAndInstall(directory, installCmd, options)
{
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(directory, 'installation_lock'), 'installing', { flag: 'wx' }, function (err) {
            if (err) 
            {
                setTimeout(function () {
                    npmLockAndInstall(directory, installCmd, options).then((result) => {
                        resolve(result);
                    });
                }, 100);
            }
            else
            {
                childProcessExec(installCmd, options).then((result) => {
                    fs.unlinkSync(path.join(directory, 'installation_lock'));
                    resolve(result);
                });
            }
        });
    });
}

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
    
    if(this.lock)
    {
        installPromises.push(npmLockAndInstall(directory, installCmd, options));
    }
    else
    {
        installPromises.push(childProcessExec(installCmd, options));
    }
    
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
    
    installFunction = npmInstall.bind({'installAppend': installAppend, 'maxBuffer': options.maxBuffer, 'tool': options.tool, 'lock': options.lock});
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
