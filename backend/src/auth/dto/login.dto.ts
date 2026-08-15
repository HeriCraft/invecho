import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: "Le nom d'utilisateur ou l'adresse email",
    example: 'GRANIX',
  })
  @IsString()
  @IsNotEmpty()
  usernameOrEmail!: string;

  @ApiProperty({
    description: 'Le mot de passe associé au compte',
    example: 'dPBP&fnCW4ZoG8',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
