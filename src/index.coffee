
fs = require "fs"
yaml = require "js-yaml"
assign = Object.assign || require("object-assign")
Promise = require "bluebird"

module.exports = (path, callback) ->
  exports.stack dir: path, data: {}, key: "root", (error, result) ->
    if error
      callback error, null
      return false
    root = result.root
    delete result.root
    data = assign root, result
    callback false, data

exports.stack = (params, callback) ->

  if !fs.existsSync(params.dir)
    callback("Folder not found" + params.dir, null)
    process.exit()
    return false

  files = fs.readdirSync(params.dir)

  for file in files
    fileFull = params.dir + "/" + file

    if fs.lstatSync(fileFull).isDirectory()
      exports.stack dir: fileFull, data: params.data, key: file, (error, result) ->
        callback error, null if error
        params.data = assign params.data, result
    else
      fileExt = file.split "."
      params.data[params.key] = {} if !(params.key of params.data)


      if fileExt[1] is "json"
        params.data[params.key][fileExt[0]] = JSON.parse fs.readFileSync fileFull, "utf8"
      if fileExt[1] is "yml" or fileExt[1] is "yaml"
        try
          params.data[params.key][fileExt[0]] = yaml.safeLoad fs.readFileSync fileFull, "utf8"
        catch e
          console.log "YAML ERROR: " + fileFull
          console.log "YAML ERROR: " + e.message
          console.log e

  callback false, params.data
