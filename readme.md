
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

* Unify data that is needed in multiple preprocessors like meta tags, colors, fonts, etc.
  * Ex: I define [colors](https://github.com/acidjazz/sake/blob/master/dat/colors.yml) and [fonts](https://github.com/acidjazz/sake/blob/master/dat/fonts.yaml) to [populate](https://github.com/acidjazz/sake/blob/master/sty/guide.styl#L4-L10) a [style guide](http://www.designsakestudio.com/guide/), and then use them throughout the [HTML](https://github.com/acidjazz/sake/blob/master/tpl/guide/index.jade#L11) and [CSS](https://github.com/acidjazz/sake/blob/master/sty/main.styl#L18) preprocessors
* Allow the possibility of others to contribute who are not familiar with the technology in use
  * Give copywriters access to their copy seamlessly
  * Give designers access to font and color values seamlessly

### Installation

```bash
$ npm install objectus
```

### Basic Usage


Say you have all your config & copy in the folder `dat/` and your meta tags in `dat/meta.yml` looking like

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

### Gulp Integration 


Start with grabbing our data, then a task to do the same

```javascript

var objectus = reuqire('objectus');

objectus('dat/', function(error, result) { data = result; });

gulp.task('objectus', function() {
  objectus('dat/', function(error, result) {
    data = result;
  });
  return true;
});
```

Now lets pass our data into a CSS preprocessor, say [Stylus](http://stylus-lang.com/)

```javascript
gulp.task('stylus', function() {
  gulp.src('sty/main.styl')
    .pipe(stylus({ rawDefine: { data: data } })
    .pipe(gulp.dest('pub/css'))
});
```

How about an HTML template engine like [Jade](https://github.com/pugjs/jade) / [the new name](https://github.com/scrooloose/syntastic/pull/1704) Pug

```javascript
gulp.task('jade', function() {
  gulp.src('tpl/**/index.jade')
    .pipe(jade({pretty: true, locals: {data: data}}))
    .pipe(gulp.dest('pub'))
});
```

Make sure when you are watching files that are compiled passing objectus, you re-compile them afterwards

```javascript
  gulp.watch('dat/**/*', ['objectus','stylus','jade']);
```


Now lets get fancy, here is a more detailed example involving browserSync, gulp-notify, and gulp-sourcemaps

```javascript

var gulp = require('gulp');
var sync = require('browser-sync').create();
var notify = require('gulp-notify');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var sourcemaps = require('gulp-sourcemaps');

var objectus = require('objectus');

objectus('dat/', function(error, result) {
  if (error) {
    notify(error);
  }
  data = result;
});

gulp.task('objectus', function() {
  objectus('dat/', function(error, result) {
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

  gulp.watch('dat/**/*', ['objectus','stylus','jade']);
  gulp.watch('sty/**/*.styl', ['stylus']);
  gulp.watch('tpl/**/*.jade', ['jade']);

});

gulp.task('default', ['objectus','stylus', 'jade']);

```

### Why call it __objectus__

The origin of the word __object__

> Middle English, from Medieval Latin objectum, from Latin, neuter of __objectus__, past participle of obicere to throw in the way, present, hinder, from ob- in the way + jacere to throw

