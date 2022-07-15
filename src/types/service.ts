import { AxiosInstance } from 'axios'
import { CookieJar } from 'tough-cookie'

import { StudentType } from '.'

export interface ServiceContext {
  client: AxiosInstance
  jar: CookieJar
}

export interface Service {
  login (
    context: ServiceContext,
    args: {
      studentId: string
      password: string
    }
  ): Promise<void>

  authen(
    context: ServiceContext,
    args: {
      studentType: StudentType,
      studentId: string
    }
  ): Promise<{ token: string }>
}
