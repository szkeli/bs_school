import { Body, JsonController, Post } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'
import { CookieJar } from 'tough-cookie'

import { getService } from './services'
import { AuthenBody, LoginBody } from './types'
import { getAxiosClient } from './utils'

@JsonController()
@OpenAPI({ summary: 'School' })
export default class Controller {
  @Post('/login')
  @OpenAPI({ summary: '登录' })
  async login (@Body() body: LoginBody) {
    const { school, studentId, password } = body
    const service = getService(school)

    const jar = new CookieJar()
    const client = getAxiosClient(jar)

    await service.login({ client, jar }, { studentId, password })

    return { cookieJar: jar.toJSON() }
  }

  @Post('/authen')
  @OpenAPI({ summary: '认证' })
  async authen (@Body() body: AuthenBody) {
    const { cookieJar, school, studentType, studentId } = body
    const service = getService(school)

    const jar = await CookieJar.deserialize(cookieJar)
    const client = getAxiosClient(jar)

    return await service.authen({ client, jar }, { studentType, studentId })
  }
}
