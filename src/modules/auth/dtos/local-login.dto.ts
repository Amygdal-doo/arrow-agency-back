import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LocalLoginDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Email',
    example: 'l2k5o@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Password',
    example: 'password',
  })
  @IsString()
  @MinLength(8, { message: 'The min length of password is 8' })
  @MaxLength(32, {
    message: " The password can't accept more than 32 characters ",
  })
  password: string;
}
