import axios from 'axios'

export async function getRandomInfo () {
  const baseUrl = 'https://dev-1306842204.cos.ap-guangzhou.myqcloud.com/constants'
  const names: string[] = await axios(`${baseUrl}/defaultNames.json`).then(res => res.data)
  const avatars: string[] = await axios(`${baseUrl}/defaultAvatars.json`).then(res => res.data)
  const randomIndex = Math.floor(Math.random() * 10000)
  return {
    name: names[randomIndex % names.length],
    avatarImageUrl: avatars[randomIndex % avatars.length]
  }
}
