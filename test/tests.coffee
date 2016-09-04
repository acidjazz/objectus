expect = require("chai").expect
objectus = require "../src/index.coffee"

describe "output", ->
  obj =
    colors:
      blue1: "#0000FF"
      red1: "#FF0000"
    config:
      url: "http://www.example.url/"
      meta:
        title: "website title"
        description: "website description"
    fonts:
      copy: "20px Tahoma"
      h1: "40px Tahoma"
      h2: "30px Tahoma"
    subdir: content:
      title: "content title"
      data: [ "test", "one", "two" ]

  it "should render an object", (done) ->
    objectus "test/config", (error, result) ->
      expect(result).to.deep.equal(obj)
      done()
  it "should error for a non-existant folder", (done) ->
    objectus "test/conf1g", (error, result) ->
      expect(error).to.equal("Folder not found: test/conf1g")
      done()
