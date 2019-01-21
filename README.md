# ws-center

[![Build Status](https://travis-ci.org/solver-workshop/ws-center.svg?branch=master)](https://travis-ci.org/solver-workshop/ws-center)

A distributed WebSocket server with high level abstractions and HTTP APIs, based on [socket.io](https://socket.io) and its [redis adapter](https://github.com/socketio/socket.io-redis).

## API Documentation

https://solver-workshop.github.io/ws-center

## How to use

### Server

Change the configurations in `/config` folder, and deploy this application.

### Client

Clients can use `socket.io client` to communicate with the server.

```js
const SocketClient = require('socket.io-client')

const client = SocketClient('http://localhost:9001', {
  query: { userId: id },
  path: '/ws'
})

client.on('message', function (body) {
  // ...
})

client.on('connect', function () {
  // ...
})
```
