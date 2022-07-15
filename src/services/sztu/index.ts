import { Service } from '../../types'
import { authen } from './authen'
import { login } from './login'

export default <Service> {
  login,
  authen
}
