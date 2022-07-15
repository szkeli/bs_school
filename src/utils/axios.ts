import axios from 'axios'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import winston from 'winston'

export function getBeforeRedirect (jar: CookieJar) {
  return (options: Record<string, any>, { headers }: {headers: Record<string, string>}) => {
    winston.debug('will redirect', { location: headers.location })
    for (const cookie of headers['set-cookie'] ?? []) {
      winston.debug('set cookie', { cookie, currentUrl: options.pathname })
      jar.setCookie(cookie, options.pathname, { ignoreError: true })
    }
  }
}

export function getAxiosClient (jar: CookieJar) {
  return wrapper(axios.create({
    jar,
    withCredentials: true,
    beforeRedirect: getBeforeRedirect(jar)
  }))
}
