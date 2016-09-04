var Promise, assign, fs, yaml;

fs = require("fs");

yaml = require("js-yaml");

assign = Object.assign || require("object-assign");

Promise = require("bluebird");

module.exports = function(path, callback) {
  return exports.stack({
    dir: path,
    data: {},
    key: "root"
  }, function(error, result) {
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

exports.stack = function(params, callback) {
  var e, error1, file, fileExt, fileFull, files, i, len;
  if (!fs.existsSync(params.dir)) {
    callback("Folder not found" + params.dir, null);
    process.exit();
    return false;
  }
  files = fs.readdirSync(params.dir);
  for (i = 0, len = files.length; i < len; i++) {
    file = files[i];
    fileFull = params.dir + "/" + file;
    if (fs.lstatSync(fileFull).isDirectory()) {
      exports.stack({
        dir: fileFull,
        data: params.data,
        key: file
      }, function(error, result) {
        if (error) {
          callback(error, null);
        }
        return params.data = assign(params.data, result);
      });
    } else {
      fileExt = file.split(".");
      if (!(params.key in params.data)) {
        params.data[params.key] = {};
      }
      if (fileExt[1] === "json") {
        params.data[params.key][fileExt[0]] = JSON.parse(fs.readFileSync(fileFull, "utf8"));
      }
      if (fileExt[1] === "yml" || fileExt[1] === "yaml") {
        try {
          params.data[params.key][fileExt[0]] = yaml.safeLoad(fs.readFileSync(fileFull, "utf8"));
        } catch (error1) {
          e = error1;
          console.log("YAML ERROR: " + fileFull);
          console.log("YAML ERROR: " + e.message);
          console.log(e);
        }
      }
    }
  }
  return callback(false, params.data);
};
