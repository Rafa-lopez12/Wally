import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, BadRequestException, UseGuards } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { GetUser } from '../usuario/decorators/get-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Auth } from '../usuario/decorators/auth.decorator';
import { ValidRoles } from '../usuario/interface/validRoles';
import { AuthGuard } from '@nestjs/passport';


@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post('register')
  @Auth(ValidRoles.usuario)
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @Get()
  @Auth(ValidRoles.usuario)
  findAll() {
    return this.clienteService.findAll();
  }

  @Get('/perfil')
  @UseGuards(AuthGuard())
  findOne(@GetUser() user:any) {
    return this.clienteService.findOne(user);
  }

  @Patch('change')
  @UseGuards(AuthGuard())
  async changeMyPassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() user: any
  ) {
    if ('rol' in user) {
      throw new BadRequestException('Este endpoint es solo para clientes');
    }
    
    return this.clienteService.changePassword(user.id, changePasswordDto);

  }

  @Patch(':id')
  @Auth(ValidRoles.usuario)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clienteService.update(id, updateClienteDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.usuario)
  remove(@Param('id') id: string) {
    return this.clienteService.remove(id);
  }


}

