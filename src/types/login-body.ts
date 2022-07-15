import { IsEnum, IsString } from 'class-validator'

import { SchoolType } from './school'

export class LoginBody {
  @IsEnum(SchoolType) school: SchoolType
  @IsString() studentId: string
  @IsString() password: string
}
