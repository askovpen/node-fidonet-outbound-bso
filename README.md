node-fidonet-outbound-bso
=========================

[![Build Status](https://travis-ci.org/askovpen/node-fidonet-outbound-bso.svg?branch=master)](https://travis-ci.org/askovpen/node-fidonet-outbound-bso)

The **Fidonet Outbound BSO parser** module is able to read BSO Outbound

[![(npm package version)](https://nodei.co/npm/fidonet-outbound-bso.png?downloads=true)](https://npmjs.org/package/fidonet-outbound-bso)

## Using Fidonet Outbound BSO parser

When you `require()` the installed module, you get a constructor that uses the path to a Squish echo base as its parameter:

```js
var BSO=require('fidonet-outbound-bso');
var bso=BSO(path,def_zone);
```

### read(callback)

Async read BSO

### (object) files

object with files and address

