import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'GRANIX' })
  username!: string;

  @ApiProperty({ example: 'granix@yopmail.com' })
  email!: string;

  @ApiProperty({ example: 'SUPER_ADMIN' })
  role!: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Le token JWT pour authentifier les futures requêtes' })
  access_token!: string;

  @ApiProperty({ type: () => UserResponseDto })
  user!: UserResponseDto;
}
