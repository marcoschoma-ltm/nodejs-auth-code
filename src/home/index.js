const Home = server => {
  server.route({
    method: 'GET',
    path: '/',
    handler: () => {
      return { hello: 'Welcome! Documentation is available in /documentation' }
    }
  })
}

module.exports = Home
