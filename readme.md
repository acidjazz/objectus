![](media/logo128.png)
objectus
========

Compile a recursive directory tree of JSON and YML files into an object

[![npm version](https://badge.fury.io/js/objectus.svg)](https://badge.fury.io/js/objectus)
[![tests](http://img.shields.io/travis/acidjazz/objectus/master.svg?style=flat)](https://travis-ci.org/acidjazz/objectus)
[![Dependency Status](https://gemnasium.com/acidjazz/objectus.svg)](https://gemnasium.com/acidjazz/objectus)
![Licence](https://img.shields.io/npm/l/objectus.svg?style=flat-square&label=licence)
[![Coverage Status](https://coveralls.io/repos/github/acidjazz/objectus/badge.svg?branch=master)](https://coveralls.io/github/acidjazz/objectus?branch=master)
[![codecov](https://codecov.io/gh/acidjazz/objectus/branch/master/graph/badge.svg)](https://codecov.io/gh/acidjazz/objectus)

[![NPM](https://nodei.co/npm/objectus.png)](https://npmjs.org/package/objectus)


```javascript
var objectus = require('objectus');

objectus('config/', function(error, result) {
  if (error) { console.log(error); }
  console.log(result);
});
```

### How it works
All YAML and JSON files in the specified folder becomes one single object.  Folders and file names become keys and values are the content 
> *Note*: Specifying a key in a folder that is the same name of a directory will result in one overwriting the other

### Why?

* Unify data that is needed in multiple preprocessors like meta tags, colors, fonts, etc.
  * Ex: I define [colors](https://github.com/acidjazz/sake/blob/master/config/colors.yml) and [fonts](https://github.com/acidjazz/sake/blob/master/config/fonts.yaml) to [populate](https://github.com/acidjazz/sake/blob/master/sty/guide.styl#L4-L10) a [style guide](http://www.designsakestudio.com/guide/), and then use them throughout the [HTML](https://github.com/acidjazz/sake/blob/master/tpl/guide/index.jade#L11) and [CSS](https://github.com/acidjazz/sake/blob/master/sty/main.styl#L18) preprocessors
* Allow the possibility of others to contribute who are not familiar with the technology in use
  * Give copywriters access to their copy seamlessly
  * Give designers access to font and color values seamlessly

### Installation

```bash
$ npm install objectus
```


### Basic Usage

Say you have all your config & copy in the folder `config/` and your meta tags in `config/meta.yml` looking like

```yaml
---
url: http://www.example.url/
tags:
  title: website title
  description: "website description"
```

If you ran 

```javascript
objectus('config/', function(error, result) {
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

Now throw in some colors you need accessed in HTML and CSS in `config/guide/` called `colors.yml` and

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

### Integration 

#### [Gulp](https://github.com/gulpjs/gulp)
Start with grabbing our data, then a task to do the same

```javascript

var objectus = reuqire('objectus');

objectus('config/', function(error, result) { data = result; });

gulp.task('objectus', function() {
  objectus('config/', function(error, result) {
    data = result;
  });
  return true;
});
```

Now you have `data` as a global object you can pass into any task needed. Make sure when you are watching files that are compiled passing objectus, you fire your objectus task first, so they get the updated data

```javascript
gulp.watch('config/**/*', ['objectus','stylus','jade']);
```

#### [Stylus](http://stylus-lang.com/)

Stylus has a define parameter you can pass, making the 3rd option true allows it to be passed 'raw'

```javascript
stylus(str).define('data', data, true)
```

In Gulp we use [gulp-stylus](https://github.com/stevelacy/gulp-stylus) and [accord](https://github.com/jenius/accord) using rawDefine which [I made sure works](https://github.com/stevelacy/gulp-stylus/issues/151)

```javascript
gulp.task('stylus', function() {
  gulp.src('sty/main.styl')
    .pipe(stylus({ rawDefine: { data: data } })
    .pipe(gulp.dest('pub/css'))
});
```

#### [Sass](https://github.com/sass/node-sass) (node-sass)

We'll write to a file somewhere you can `@import` it, make sure this is done before the sass compilation

```javascript
fs.writeFileSync('pub/jst/data.js', "var data = " + JSON.stringify(data) + ";", 'utf8')
```
```sass
@import 'pub/jst/data.json'
```
> *Note*: If you know of a better way of doing this please let me know

#### Javascript / CoffeeScript

Same simplicity, just dump our data somewhere to pick it up client-side

```javascript
fs.writeFileSync('pub/jst/data.js', "var data = " + JSON.stringify(data) + ";", 'utf8')
```
```html
<script type="text/javascript" src="/jst/data.js" />
```

#### [Jade](https://github.com/pugjs/jade) / [the new name](https://github.com/scrooloose/syntastic/pull/1704) Pug

Jade has a locals parameter, perfect 

```javascript
gulp.task('jade', function() {
  gulp.src('tpl/**/index.jade')
    .pipe(jade({pretty: true, locals: {data: data}}))
    .pipe(gulp.dest('pub'))
});
```
#### Detailed Example

Here is a more detailed example with Stylus and Jade involving browserSync, gulp-notify, and gulp-sourcemaps

```javascript

var gulp = require('gulp');
var sync = require('browser-sync').create();
var notify = require('gulp-notify');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var sourcemaps = require('gulp-sourcemaps');

var objectus = require('objectus');

objectus('config/', function(error, result) {
  if (error) {
    notify(error);
  }
  data = result;
});

gulp.task('objectus', function() {
  objectus('config/', function(error, result) {
    if (error) {
      notify(error);
    }
    data = result;
  });
  return true;
});

gulp.task('stylus', function() {
  gulp.src('sty/main.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({ rawDefine: { data: data } })
    .on('error', notify.onError(function(error) {
      return {title: "Stylus error: " + error.name, message: error.message, sound: 'Pop' };
    })))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('pub/css'))
    .pipe(sync.stream());
});


gulp.task('jade', function() {
  gulp.src('tpl/**/index.jade')
    .pipe(jade({pretty: true, locals: {data: data}})
      .on('error', notify.onError(function(error) {
        return {title: "Jade error: " + error.name, message: error.message, sound: 'Pop' };
      }))
      .on('error', function(error) {
        console.log(error);
      })
    )
    .pipe(gulp.dest('pub'))
    .pipe(sync.stream());
});

gulp.task('sync', function() {
  sync.init({
    server: {
      baseDir: 'pub/',
    }
  });

  gulp.watch('config/**/*', ['objectus','stylus','jade']);
  gulp.watch('sty/**/*.styl', ['stylus']);
  gulp.watch('tpl/**/*.jade', ['jade']);

});

gulp.task('default', ['objectus','stylus', 'jade']);

```

### Why call it __objectus__

The origin of the word __object__

> Middle English, from Medieval Latin objectum, from Latin, neuter of __objectus__, past participle of obicere to throw in the way, present, hinder, from ob- in the way + jacere to throw

