#Purpose

The module linker is a tool to recursively install npm dependencies in modules.

#Behavior

It uses 'npm install' for installing and 'act-on-modules' project to find modules (recursively traversing directories and stopping whenever it finds a package.json file).

#Usage


##Signature

```
const recursiveInstaller = require('recursive-installer');
recursiveInstaller([<Strings of paths containing modules to install npm dependencies on>], <optional argument to append to the npm install command>) //Returns a promise
```

##Example

```
const recursiveInstaller = require('recursive-installer');
moduleLinker.linker(['/home/eric/app', '/home/eric/nodeJsModules'], '--production').then(() => {
    console.log('all done');
});
```

##Running Tests

Run ```npm test```

##Installation

Run ```npm install recursive-installer```
