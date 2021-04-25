import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: '标题', example: '帖子的标题' })
  @IsNotEmpty({ message: '缺少标题' })
  title: string;
  @ApiProperty({ description: '正文', example: '帖子的内容' })
  content: string;
  // // 发帖人
  // creatorId: string;
  // creatorUsername: string;
}
