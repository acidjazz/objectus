
objectus
========

Compile a recursive directory tree of JSON and YML files into an object

[![npm version](https://badge.fury.io/js/objectus.svg)](https://badge.fury.io/js/objectus)
[![tests](http://img.shields.io/travis/acidjazz/objectus/master.svg?style=flat)](https://travis-ci.org/acidjazz/objectus)
[![Dependency Status](https://gemnasium.com/acidjazz/objectus.svg)](https://gemnasium.com/acidjazz/objectus)
![Licence](https://img.shields.io/npm/l/objectus.svg?style=flat-square&label=licence)

[![NPM](https://nodei.co/npm/objectus.png)](https://npmjs.org/package/objectus)


```javascript
var objectus = require('objectus');

objectus('dat/', function(error, result) {
  if (error) { console.log(error); }
  console.log(result);
});
```

### Why?

Here are some major reasons I needed this functionality

* Allow the possibility of others to contribute who are not familiar with the technology in use
  * Give copywriters access to copy without being a middle man
  * Give designers access to font and color values transparently
* Unify data that is needed in multiple preprocessors like meta tags, colors, fonts, etc.
  * Ex: I define [colors](https://github.com/acidjazz/sake/blob/master/dat/colors.yml) and [fonts](https://github.com/acidjazz/sake/blob/master/dat/fonts.yml) to [populate](https://github.com/acidjazz/sake/blob/master/sty/guide.styl#L4-L10) a [style guide](http://www.designsakestudio.com/guide/), and then use them throughout the [HTML](https://github.com/acidjazz/sake/blob/master/tpl/guide/index.jade#L11) and [CSS](https://github.com/acidjazz/sake/blob/master/sty/main.styl#L18) preprocessors

### Installation

```bash
$ npm install objectus
```

### Basic Usage

Say you have all your copy in the folder `dat/` and your meta tags in `dat/meta.yml` looking like

```yaml
---
url: http://www.example.url/
meta:
  title: website title
  description: "website description"
```

If you ran 

```javascript
objectus('dat/', function(error, result) {
  console.log(result);
});
```

You would see in your console

```json
   meta: {
      "url": "http://www.example.url/",
      "meta": {
        "title": "website title",
        "description": "website description"
      }
    }
```

