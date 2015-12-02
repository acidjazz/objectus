
fs = require 'fs'
yaml = require 'js-yaml'
assign = Object.assign || require('object-assign')

module.exports = (path) ->
  data = exports.stack(path, {}, 'root')
  root = data.root
  delete data.root
  data = assign root, data
  return data

exports.stack = (dir, data, key) ->

  if !fs.existsSync(dir)
    console.log 'Folder not found'
    process.exit()
    return false

  files = fs.readdirSync(dir)

  for file in files
    fileFull = dir + '/' + file

    if fs.lstatSync(fileFull).isDirectory()
      data = assign data, this.stack(fileFull, data, file)
    else
      fileExt = file.split '.'
      data[key] = {} if !(key of data)


      if fileExt[1] is 'json'
        data[key][fileExt[0]] = JSON.parse fs.readFileSync fileFull, 'utf8'
      if fileExt[1] is 'yml' or fileExt[1] is 'yaml'
        data[key][fileExt[0]] = yaml.safeLoad fs.readFileSync fileFull, 'utf8'

  return data


