import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReplyPostDto {
  @ApiProperty({ description: '正文', example: '帖子的内容' })
  @IsNotEmpty({ message: '回帖内容不能为空' })
  content: string;
  @ApiProperty({ description: '回帖时间', example: '' })
  replyAt: string;
}
