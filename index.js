var fs = require('fs');
var assign = Object.assign || require('object-assign');
var yaml = require('js-yaml');
var json = require('json');

module.exports = function (path) {
  var data, root;
  data = exports.stack(path, {}, 'root');
  root = data.root;
  delete data.root;
  data = assign(root, data);
  return data;
};

exports.stack = function(dir, data, key) {
  var file, fileExt, fileFull, files, i, len;
  if (!fs.existsSync(dir)) {
    console.log('Folder not found');
    process.exit();
    return false;
  }
  files = fs.readdirSync(dir);
  for (i = 0, len = files.length; i < len; i++) {
    file = files[i];
    fileFull = dir + '/' + file;
    if (fs.lstatSync(fileFull).isDirectory()) {
      data = assign(data, this.stack(fileFull, data, file));
    } else {
      fileExt = file.split('.');
      if (!(key in data)) {
        data[key] = {};
      }
      if (fileExt[1] === 'json') {
        data[key][fileExt[0]] = JSON.parse(fs.readFileSync(fileFull, 'utf8'));
      }
      if (fileExt[1] === 'yml' || fileExt[1] === 'yaml') {
        data[key][fileExt[0]] = yaml.safeLoad(fs.readFileSync(fileFull, 'utf8'));
      }
    }
  }
  return data;
};


