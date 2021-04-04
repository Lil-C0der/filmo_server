import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'testUser1' })
  @IsNotEmpty({ message: '缺少用户名' })
  username: string;
  @IsNotEmpty({ message: '缺少密码' })
  @ApiProperty({ description: '登录密码', example: 'aStrongPassword123' })
  pwd: string;
}
