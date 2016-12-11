#Purpose

The recursive installer is a tool to recursively install npm dependencies in modules.

#Behavior

It uses either npm or yarn (depending on the tool option passed to the library) for installing and 'act-on-modules' project to find modules (recursively traversing directories and stopping whenever it finds a package.json file).

#Usage

##Signature

```
const recursiveInstaller = require('recursive-installer');
recursiveInstaller([<Strings of paths containing modules to install npm dependencies on>], <options>) //Returns a promise
```

```<options>``` is an object that can be passed (optionally), the following keys:

- arguments: Arguments to pass to the install command (can be a string or array or strings)

- maxBuffer: Maximum size allocated to stdout/stderr subprocesses (in bytes)

- tool: Tool that should perform the module install. Currently, the library supports 'npm' and 'yarn'. Npm is the default if this option is omitted.

##Example

```
const recursiveInstaller = require('recursive-installer');
recursiveInstaller(['/home/eric/app', '/home/eric/nodeJsModules'], {
    arguments: '--production',
    maxBuffer: 5*1024*1024, //5 MB
    tool: 'yarn'
}).then(() => {
    console.log('all done');
});
```

##Running Tests

Run ```npm test```

##Installation

Run ```npm install recursive-installer```

##Requirements

To run the yarn test or generally to run the library with the 'yarn' tool option, you need to have yarn installed.

Also, the yarn part of the tests will fail if yarn is not installed.