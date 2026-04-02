import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ 
    example: 'john@example.com', 
    description: 'Email address for password reset' 
  })
  @IsEmail()
  email: string;
}
