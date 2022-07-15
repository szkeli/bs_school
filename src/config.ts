import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

export interface Config {
    port: number
    jwtSecretKey: string
    debugLogging: boolean
}

export default <Config> {
  port: +(process.env.PORT || 9000),
  jwtSecretKey: process.env.JWT_SECRET_KEY || '',
  debugLogging: process.env.NODE_ENV === 'development'
}
