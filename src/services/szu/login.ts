import { load } from 'cheerio'
import CryptoJS from 'crypto-js'
import { URLSearchParams } from 'url'
import winston from 'winston'

import { Service } from '../../types'

function randomString (len: number): string {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  return Array(len)
    .fill(0)
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join('')
}

function encryptPassword (password: string, salt: string): string {
  return CryptoJS.AES.encrypt(
    randomString(64) + password,
    CryptoJS.enc.Utf8.parse(salt.trim()),
    {
      iv: CryptoJS.enc.Utf8.parse(randomString(16)),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  ).toString()
}

const AUTHSERVER_URL = 'https://authserver.szu.edu.cn'

export const login: Service['login'] = async ({ client }, { studentId, password }) => {
  const html = await client({
    method: 'GET',
    url: `${AUTHSERVER_URL}/authserver/login?service=http%3A%2F%2Fehall.szu.edu.cn%2Flogin%3Fservice%3Dhttp%3A%2F%2Fehall.szu.edu.cn%2Fnew%2Findex.html`
  }).then(res => res.data)
  const $ = load(html)

  const salt = $('#casLoginForm > input[id=pwdDefaultEncryptSalt]').val() as string
  // const needCaptcha = await request({ url: NEEDCAPTCHA_URL, params: { username, pwdEncrypt2: 'pwdEncryptSalt' } }).then(res => res.data)

  const params = {
    username: studentId,
    password: encryptPassword(password, salt),
    lt: $('#casLoginForm > input[name=lt]').val(),
    dllt: $('#casLoginForm > input[name=dllt]').val(),
    execution: $('#casLoginForm > input[name=execution]').val(),
    _eventId: $('#casLoginForm > input[name=_eventId]').val(),
    rmShown: $('#casLoginForm > input[name=rmShown]').val()
  } as Record<string, string>

  winston.debug('login params', params)

  await client({
    method: 'POST',
    url: `${AUTHSERVER_URL}${$('#casLoginForm').attr('action')}`,
    data: new URLSearchParams(params).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
