import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [User],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
