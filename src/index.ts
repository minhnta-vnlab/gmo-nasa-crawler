import fastify from 'fastify'
import nasaCrawlRoute from './routes/nasa.crawl.route'
import env from './env'

const server = fastify()

server.register(nasaCrawlRoute, {
  prefix: "/nasa"
})

server.setErrorHandler((error, request, reply) => {
  console.error('Global Error Handler:', error);
  reply.status(500).send({ ok: false, error: error })
})

server.listen({ port: env.CRAWL_SERVER_PORT, host: '0.0.0.0'}, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})