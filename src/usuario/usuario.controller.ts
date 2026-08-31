import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginUsuarioDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { request } from 'http';
import { GetUser } from './decorators/get-user.decorator';
import { Usuario } from './entities/usuario.entity';
import { UserRolGuard } from './guards/user-rol.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interface/validRoles';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService
  
  ) {}

  @Post('register')
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Post('login')
  loginUser(@Body() loginUsuarioDto: LoginUsuarioDto) {
    return this.usuarioService.login(loginUsuarioDto);
  }

  @Get('check-status')
  @UseGuards(AuthGuard())
  checkAuthStatus(@GetUser() user:Usuario){
    return this.usuarioService.checkStatus(user)
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}
