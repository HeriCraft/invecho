import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Connexion de l'utilisateur", description: 'Permet de récupérer un token JWT avec les credentials fournis.' })
  @ApiResponse({ status: 200, description: 'Connexion réussie, retourne le token et les infos utilisateur.', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Identifiants invalides.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
