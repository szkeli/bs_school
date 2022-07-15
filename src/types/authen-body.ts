import { IsEnum, IsObject, IsString } from 'class-validator'
import { CookieJar } from 'tough-cookie'

import { SchoolType } from './school'
import { StudentType } from './student'

export class AuthenBody {
  @IsObject() cookieJar: CookieJar.Serialized
  @IsEnum(SchoolType) school: SchoolType
  @IsEnum(StudentType) studentType: StudentType
  @IsString() studentId: string
}
