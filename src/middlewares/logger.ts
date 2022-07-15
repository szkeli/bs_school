import { KoaMiddlewareInterface, Middleware } from 'routing-controllers'
import winston, { format, transports } from 'winston'

import config from '../config'

@Middleware({ type: 'before' })
export class LoggingMiddleware implements KoaMiddlewareInterface {
  constructor () {
    winston.configure({
      level: config.debugLogging ? 'debug' : 'info',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple()
          )
        })
      ]
    })
  }

  async use (ctx: any, next: (err?: any) => Promise<any>): Promise<void> {
    winston.info(`${ctx.method} ${ctx.originalUrl}`)

    const start = new Date().getTime()
    try {
      await next()
    } catch (err) {
      ctx.status = err.status || 500
      ctx.body = err.message
    }
    const end = new Date().getTime()
    const dutation = end - start

    let logLevel: string
    if (ctx.status >= 500) {
      logLevel = 'error'
    } else if (ctx.status >= 400) {
      logLevel = 'warn'
    } else {
      logLevel = 'info'
    }

    winston.log(logLevel, `${ctx.status} ${ctx.message} ${dutation}ms`)
  }
}
