import cors from '@koa/cors'
import { defaultMetadataStorage } from 'class-transformer/storage'
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import Koa from 'koa'
import { koaSwagger } from 'koa2-swagger-ui'
import { createKoaServer, getMetadataArgsStorage, RoutingControllersOptions } from 'routing-controllers'
import { routingControllersToSpec } from 'routing-controllers-openapi'
import winston from 'winston'

import 'reflect-metadata'

import config from './config'
import Controller from './controller'
import { LoggingMiddleware } from './middlewares/logger'

const routingControllersOptions: RoutingControllersOptions = {
  controllers: [Controller],
  middlewares: [LoggingMiddleware]
}

const app: Koa = createKoaServer(routingControllersOptions)
const spec = routingControllersToSpec(
  getMetadataArgsStorage(),
  routingControllersOptions,
  {
    components: {
      schemas: validationMetadatasToSchemas({
        classTransformerMetadataStorage: defaultMetadataStorage,
        refPointerPrefix: '#/components/schemas/'
      })
    },
    info: {
      description: 'Generated with `routing-controllers-openapi`',
      title: 'BlankSpace School API',
      version: '1.0.0'
    }
  }
)

app.use(cors())
app.use(koaSwagger({ routePrefix: '/docs', swaggerOptions: { spec } }))

app.listen(config.port, () => {
  winston.info(`🚀 Server ready at http://localhost:${config.port}`)
})
