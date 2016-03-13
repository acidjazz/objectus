objectus
========

```javascript

objectus('dat/', function(error, result) {

  if (error) {
    console.log(error);
  }

  console.log(result);

});


```

[![npm version](https://badge.fury.io/js/objectus.svg)](https://badge.fury.io/js/objectus)
[![tests](http://img.shields.io/travis/acidjazz/objectus/master.svg?style=flat)](https://travis-ci.org/acidjazz/objectus)
[![Dependency Status](https://gemnasium.com/acidjazz/objectus.svg)](https://gemnasium.com/acidjazz/objectus)
![Licence](https://img.shields.io/npm/l/objectus.svg?style=flat-square&label=licence)

[![NPM](https://nodei.co/npm/objectus.png)](https://npmjs.org/package/objectus)

Compile a recursive directory tree of JSON and YML files into an object

> **Note:** Still in early development

### Why?

This module is to unify data of legible format for various reasons

* Allow the possibility of others to contribute who are not familiar with the technology in use
* Unify data that is needed in various preprocessors like meta data, colors, fonts, etc.
  * Ex: I define [colors](https://github.com/acidjazz/sake/blob/master/dat/colors.yml) and [fonts](https://github.com/acidjazz/sake/blob/master/dat/fonts.yml) to [populate](https://github.com/acidjazz/sake/blob/master/sty/guide.styl#L4-L10) a [style guide](http://www.designsakestudio.com/guide/), and then use them throughout the [HTML](https://github.com/acidjazz/sake/blob/master/tpl/guide/index.jade#L11) and [CSS](https://github.com/acidjazz/sake/blob/master/sty/main.styl#L18) preprocessors



### Installation

TBA

### Usage

TBA


