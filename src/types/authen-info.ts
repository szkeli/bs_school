import { Gender } from './gender'

export interface AuthenInfo {
  /** 头像 */ avatarImageUrl: string
  /** 昵称 */ name: string
  /** 学号 */ studentId: string
  /** 学校 */ universities: string[]
  /** 校区 */ subCampuses: string[]
  /** 学院 */ institutes: string[]
  /** 班级 */ grade: string
  /** 性别 */ gender: Gender
}
