import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PromocionService } from './promocion.service';
import { CreatePromocionDto } from './dto/create-promocion.dto';
import { UpdatePromocionDto } from './dto/update-promocion.dto';
import { Auth } from '../usuario/decorators/auth.decorator';
import { validate } from 'class-validator';
import { ValidRoles } from '../usuario/interface/validRoles';
import { AuthGuard } from '@nestjs/passport';

@Controller('promocion')
export class PromocionController {
  constructor(private readonly promocionService: PromocionService) {}

  @Post()
  @Auth(ValidRoles.usuario)
  create(@Body() createPromocionDto: CreatePromocionDto) {
    return this.promocionService.create(createPromocionDto);
  }

  @Get()
  @Auth(ValidRoles.usuario)
  findAll() {
    return this.promocionService.findAll();
  }

  @Patch(':id')
  @Auth(ValidRoles.usuario)
  update(@Param('id') id: string, @Body() updatePromocionDto: UpdatePromocionDto) {
    return this.promocionService.update(+id, updatePromocionDto);
  }

  @Get('view')
  @UseGuards(AuthGuard())
  promocioView(){
    return this.promocionService.promocioView()
  }

}
