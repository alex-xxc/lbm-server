import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateOrUpdateContentTagsDto {
  @ApiProperty({ description: '内容id' })
  @IsNumberString({}, { message: '内容Id 类型错误，正确类型 string' })
  @IsNotEmpty({ message: '内容Id 不能为空' })
  contentId: string

  @ApiProperty({ description: '标签id 集合' })
  @IsNumberString({}, { each: true, message: '标签id集合中存在类型错误，正确类型 string[]' })
  @IsNotEmpty({ each: true, message: '角色id集合中存在为空' })
  tagsIds: string[]
}
