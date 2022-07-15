import axios, { CanceledError } from 'axios'
import CryptoJS from 'crypto-js'
import { URLSearchParams } from 'url'
import winston from 'winston'

import { Service } from '../../types'
import { getBeforeRedirect } from '../../utils'

function encryptPassword (password: string) {
  return CryptoJS.DES.encrypt(
    password,
    CryptoJS.enc.Utf8.parse('PassB01I171'),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  ).toString()
}

export const login: Service['login'] = async ({ client, jar }, { studentId, password }) => {
  winston.debug('client get', 'https://auth.sztu.edu.cn/idp/oauth2/authorize?redirect_uri=https%3A%2F%2Fjwxt.sztu.edu.cn%2FLogon.do%3Fmethod%3DlogonSSOszjsdx&state=1111&client_id=jiaowu&response_type=code')
  await client({
    method: 'GET',
    url: 'https://auth.sztu.edu.cn/idp/oauth2/authorize?redirect_uri=https%3A%2F%2Fjwxt.sztu.edu.cn%2FLogon.do%3Fmethod%3DlogonSSOszjsdx&state=1111&client_id=jiaowu&response_type=code'
  })

  const params = {
    j_username: studentId,
    j_password: encryptPassword(password),
    j_checkcode: '验证码',
    op: 'login',
    spAuthChainCode: 'cc2fdbc3599b48a69d5c82a665256b6b'
  }

  winston.debug('login params', params)

  await jar.setCookie('x=x', 'https://auth.sztu.edu.cn')

  winston.debug('client post', 'https://auth.sztu.edu.cn/idp/authcenter/ActionAuthChain')
  await client({
    method: 'POST',
    url: 'https://auth.sztu.edu.cn/idp/authcenter/ActionAuthChain',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: new URLSearchParams(params)
  })

  try {
    const controller = new AbortController()
    const beforeRedirect = getBeforeRedirect(jar)
    winston.debug('client post', 'https://auth.sztu.edu.cn/idp/AuthnEngine?currentAuth=urn_oasis_names_tc_SAML_2.0_ac_classes_BAMUsernamePassword')
    await client({
      method: 'POST',
      url: 'https://auth.sztu.edu.cn/idp/AuthnEngine?currentAuth=urn_oasis_names_tc_SAML_2.0_ac_classes_BAMUsernamePassword',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: new URLSearchParams(params),
      signal: controller.signal,
      beforeRedirect: (options, { headers }) => {
        if (options.href === 'http://jwxt.sztu.edu.cn/jsxsd/framework/xsMain.htmlx') {
          winston.debug('cancel redirect', options.href)
          controller.abort()
        } else {
          beforeRedirect(options, { headers })
        }
      }
    })
  } catch (err) {
    if (!(err instanceof CanceledError)) {
      throw err
    }
  }

  console.log('jar', jar.toJSON())

  // test
  await axios({
    method: 'GET',
    url: 'http://jwxt.sztu.edu.cn',
    withCredentials: true,
    jar
  }).then(console.log)
}
