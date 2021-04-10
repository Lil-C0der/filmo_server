import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '用户名', example: '新用户1' })
  @IsNotEmpty({ message: '缺少用户名' })
  username: string;
  @ApiProperty({ description: '密码', example: 'password123' })
  @IsNotEmpty({ message: '缺少密码' })
  password: string;
}
