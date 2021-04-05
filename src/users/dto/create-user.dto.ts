import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'usr1' })
  @IsNotEmpty({ message: '缺少用户名' })
  username: string;
  @ApiProperty({ description: '登录密码', example: 'pwd123' })
  @IsNotEmpty({ message: '缺少密码' })
  pwd: string;
}
