import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, ForbiddenException, UseGuards, Query } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { GetUser } from '../usuario/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from '../usuario/decorators/auth.decorator';
import { ValidRoles } from '../usuario/interface/validRoles';

@Controller('reserva')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservaService.create(createReservaDto);
  }

  // en reserva.controller.ts

  @Get('mensaje-dia')
  @Auth(ValidRoles.usuario) // solo usuarios
  getMensajeDia(@Query('fecha') fecha: string) {
    return this.reservaService.reservasParaMensaje(fecha);
  }

  @Get('reporte')
  @Auth(ValidRoles.usuario) // solo usuarios, nunca clientes
  getReporte(
    @Query('tipo') tipo: 'diario' | 'mensual',
    @Query('fecha') fecha: string,
  ) {
    return this.reservaService.reporteMonto(tipo, fecha);
  }

  @Get('my-reservas')
  @UseGuards(AuthGuard())
  async getMyReservas(@GetUser() user: any) {
  // Si es usuario, no tiene sentido este endpoint
  if ('rol' in user) {
    throw new BadRequestException('Este endpoint es solo para clientes');
  }
  return this.reservaService.getReservasByClient(user);
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll() {
    return this.reservaService.getReservas();
  }

  @Get('/pendiente')
  @UseGuards(AuthGuard())
  findOne( @GetUser() user: any) {
    return this.reservaService.findRerservaPen(user);
  }

  @Get('/count')
  @UseGuards(AuthGuard())
  findCount( @GetUser() user: any){
    return this.reservaService.findCountReservas(user)
  }

 /* @Patch(':id')
  @UseGuards(AuthGuard())
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservaService.update(+id, updateReservaDto);
  }*/

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Param('id') id: string) {
    return this.reservaService.remove(+id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard())
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto, @GetUser() user: any) {
    return this.reservaService.updateReserva(+id, updateReservaDto, user);
  }

  


/*
// Estadísticas mensuales (solo para usuarios)
@Get('stats/monthly/:year/:month')
async getMonthlyStats(
  @Param('year') year: string, 
  @Param('month') month: string,
  @GetUser() user: any
) {
  // Solo usuarios pueden ver estadísticas
  if (!('rol' in user)) {
    throw new ForbiddenException('Solo los usuarios pueden acceder a las estadísticas');
  }
 // return this.reservaService.getMonthlyStats(parseInt(year), parseInt(month));
}*/


/*
// Reservas de un cliente específico
@Get('client/:clienteId/reservas')
async getClientReservas(@Param('clienteId') clienteId: string, @GetUser() user: any) {
  // Si es cliente, solo puede ver sus propias reservas
  if (!('rol' in user) && user.id !== clienteId) {
    throw new ForbiddenException('Solo puedes ver tus propias reservas');
  }
  return this.reservaService.getReservasByClient(clienteId);
}*/



}
