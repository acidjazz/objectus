
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

* Allow the possibility of others to contribute who are not familiar with the technology in use
  * Give copywriters access to their copy seamlessly
  * Give designers access to font and color values transparently
* Unify data that is needed in multiple preprocessors like meta tags, colors, fonts, etc.
  * Ex: I define [colors](https://github.com/acidjazz/sake/blob/master/dat/colors.yml) and [fonts](https://github.com/acidjazz/sake/blob/master/dat/fonts.yml) to [populate](https://github.com/acidjazz/sake/blob/master/sty/guide.styl#L4-L10) a [style guide](http://www.designsakestudio.com/guide/), and then use them throughout the [HTML](https://github.com/acidjazz/sake/blob/master/tpl/guide/index.jade#L11) and [CSS](https://github.com/acidjazz/sake/blob/master/sty/main.styl#L18) preprocessors

### Installation

```bash
$ npm install objectus
```

### Basic Usage


Say you have all your config/opy in the folder `dat/` and your meta tags in `dat/meta.yml` looking like

```yaml
---
url: http://www.example.url/
tags:
  title: website title
  description: "website description"
```

If you ran 

```javascript
objectus('dat/', function(error, result) {
  console.log(result);
});
```

You would see 

```javascript
meta: {
  url: "http://www.example.url/",
  tags: {
    title: "website title",
    description: "website description"
  }
}
```

Now throw in some colors you need accessed in HTML and CSS in `dat/guide/` called `colors.yml` and

```yml
---
blue1: "#0000FF"
red1: "#FF0000"
```

..will stack and then result in

```javascript
meta: {
  url: "http://www.example.url/",
  tags: {
    title: "website title",
    description: "website description"
  }
},
guide: {
  colors: {
    blue1: "#0000FF",
    red1: "#FF0000"
  }
}

```

> __Note__: Folders become keys and values are the objectus'ed files, so specifying a key in a folder the same name of a directory in the same will result in one overwriting the other



### Why __objectus__

The origin of __object__

> Middle English, from Medieval Latin objectum, from Latin, neuter of objectus, past participle of obicere to throw in the way, present, hinder, from ob- in the way + jacere to throw

