import jwt from 'jsonwebtoken'

import config from '../../config'
import { AuthenInfo, Gender, Service, StudentType } from '../../types'
import { getRandomInfo } from '../../utils'

const EHALL_URL = 'http://ehall.szu.edu.cn'

export const authen: Service['authen'] = async ({ client }, { studentType, studentId }) => {
  const { name, urls, dataName, colName } = {
    [StudentType.Undergraduate]: {
      name: '本科',
      urls: [`${EHALL_URL}/appShow?appId=4963166251928707`, `${EHALL_URL}/jwapp/sys/xjxxbg/modules/xsjbxx/xjxxxq.do`],
      dataName: 'xjxxxq',
      colName: {
        college: 'YXDM_DISPLAY',
        subCampus: 'XXXQDM_DISPLAY',
        grade: 'XZNJ_DISPLAY',
        gender: 'XBDM_DISPLAY'
      }
    },
    [StudentType.Postgraduate]: {
      name: '研究',
      url: [`${EHALL_URL}/appShow?appId=4894740607320750`, `${EHALL_URL}/gsapp/sys/wdxj/modules/wdxj/xsjcxxcx.do`],
      dataName: 'xsjcxxcx',
      colName: {
        college: 'YXDM_DISPLAY',
        subCampus: 'XQDM_DISPLAY',
        grade: 'NJDM_DISPLAY',
        gender: 'XBDM_DISPLAY'
      }
    }
  }[studentType]

  await client({ method: 'GET', url: urls[0] })
  const data: Record<string, string> = await client({
    method: 'POST',
    url: urls[1],
    data: new URLSearchParams({ XH: studentId }).toString()
  }).then(res => res.data.datas[dataName].rows[0])

  const info: AuthenInfo = {
    ...(await getRandomInfo()),
    studentId,
    universities: ['深圳大学'],
    institutes: [data[colName.college]],
    subCampuses: [data[colName.subCampus]],
    grade: [name, data[colName.grade].substring(2)].join(' '),
    gender: (() => {
      switch (data[colName.gender]) {
        case '男': return Gender.Male
        case '女': return Gender.Female
        default: return Gender.None
      }
    })()
  }

  const token = jwt.sign(
    info,
    config.jwtSecretKey,
    { noTimestamp: true }
  )

  return { token }
}
