import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CanchaService } from './cancha.service';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from '../usuario/decorators/auth.decorator';
import { ValidRoles } from '../usuario/interface/validRoles';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-reserva.dto';


@Controller('cancha')
export class CanchaController {
  constructor(private readonly canchaService: CanchaService) {}


  @Get()
  @UseGuards(AuthGuard())
  findAll() {
    return this.canchaService.findAll();
  }

  @Post()
  @Auth(ValidRoles.usuario)
  create(@Body() canchaDto: CreateCanchaDto){
    return this.canchaService.create(canchaDto)
  }

  @Patch(':id')
  @Auth(ValidRoles.usuario)
  update(@Param('id') id: number, @Body() updateCanchaDto: UpdateCanchaDto){
    return this.canchaService.update(id,updateCanchaDto)
  }

}
