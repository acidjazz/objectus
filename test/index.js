var expect;

expect = require('chai').expect;

describe('output', function() {
  var obj;
  obj = {
    colors: {
      blue1: '#0000FF',
      red1: '#FF0000'
    },
    config: {
      url: 'http://www.example.url/',
      meta: {
        title: 'website title',
        description: 'website description'
      }
    },
    fonts: {
      copy: '20px Tahoma',
      h1: '40px Tahoma',
      h2: '30px Tahoma'
    },
    subdir: {
      content: {
        title: 'content title',
        data: ['test', 'one', 'two']
      }
    }
  };
  before(function() {
    return this.objectus = require('../index.js');
  });
  return it('should render an object', function(done) {
    return this.objectus('test/dat', function(error, result) {
      expect(result).to.deep.equal(obj);
      return done();
    });
  });
});
