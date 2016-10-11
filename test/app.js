require = require('really-need');
var should  = require('should');
var expect  = require("chai").expect;
var io      = require('socket.io-client');
var server  = require('../app');
var request = require('supertest').agent(server.listen());

var port    = process.env.PORT || 8000;	// Set the default port number to 8000, or use Heroku's settings (process.env.PORT)
var socketUrl = "http://localhost:" + port;

var options ={
    transports: ['websocket'],
    'force new connection': true
};

var clientProperty = {owner:'client',
                      msg:  'Hello from the client!',
                      id:   Math.floor((Math.random() * 1000) + 1)};

describe("Paint Server", function() {
  describe("on user connection", function() {
    /* Test 1 - A Single User */
    it('should identify itself to the client',function(done){
      var client = io.connect(socketUrl, options);
      request
        .get("/")
        .end(done);

      client.on('connect',function(data) {
        client.emit('test',clientProperty);
      });

      client.on('test',function(serverProperties) {
        serverProperties.owner.should.be.type('string');
        serverProperties.owner.should.equal("server");
        /* If this client doesn't disconnect it will interfere
         *       with the next test */
        client.disconnect();
        server.close();
        done();
      });
    });
  });
});
