var Promise, assign, fs, yaml;

fs = require('fs');

yaml = require('js-yaml');

assign = Object.assign || require('object-assign');

Promise = require('bluebird');

module.exports = function(path, callback) {
  return exports.stack(path, {}, 'root', function(error, result) {
    var data, root;
    if (error) {
      callback(error, null);
      return false;
    }
    root = result.root;
    delete result.root;
    data = assign(root, result);
    return callback(false, data);
  });
};

exports.stack = function(dir, data, key, callback) {
  var file, fileExt, fileFull, files, i, len;
  if (!fs.existsSync(dir)) {
    callback('Folder not found' + dir, null);
    process.exit();
    return false;
  }
  files = fs.readdirSync(dir);
  for (i = 0, len = files.length; i < len; i++) {
    file = files[i];
    fileFull = dir + '/' + file;
    if (fs.lstatSync(fileFull).isDirectory()) {
      this.stack(fileFull, data, file, function(error, result) {
        if (error) {
          callback(error, null);
        }
        return data = assign(data, result);
      });
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
  return callback(false, data);
};
