
fs = require "fs"
yaml = require "js-yaml"
assign = Object.assign || require("object-assign")
Promise = require "bluebird"

module.exports = (path, callback) ->
  exports.stack path, {}, "root", (error, result) ->
    if error
      callback error, null
      return false
    root = result.root
    delete result.root
    data = assign root, result
    callback false, data

exports.stack = (dir, data, key, callback) ->

  if !fs.existsSync(dir)
    callback("Folder not found" + dir, null)
    process.exit()
    return false

  files = fs.readdirSync(dir)

  for file in files
    fileFull = dir + "/" + file

    if fs.lstatSync(fileFull).isDirectory()
      this.stack fileFull, data, file, (error, result) ->
        callback error, null if error
        data = assign data, result
    else
      fileExt = file.split "."
      data[key] = {} if !(key of data)


      if fileExt[1] is "json"
        data[key][fileExt[0]] = JSON.parse fs.readFileSync fileFull, "utf8"
      if fileExt[1] is "yml" or fileExt[1] is "yaml"
        try
          data[key][fileExt[0]] = yaml.safeLoad fs.readFileSync fileFull, "utf8"
        catch e
          console.log "YAML ERROR: " + fileFull
          console.log "YAML ERROR: " + e.message
          console.log e

  callback false, data


