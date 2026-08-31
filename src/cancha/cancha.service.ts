import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cancha } from './entities/cancha.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCanchaDto } from './dto/update-reserva.dto';
import { CreateCanchaDto } from './dto/create-cancha.dto';


@Injectable()
export class CanchaService {

  constructor(
    @InjectRepository(Cancha)
    private readonly canchaRepository:Repository<Cancha>
  ){}
 
  findAll() {
    const cancha=this.canchaRepository.find()
    return cancha
  }

  async update(id: number, updateCancha: UpdateCanchaDto) {
    const reserva=await this.canchaRepository.preload({
      id:id,
      cancha: updateCancha.cancha,
      estado: updateCancha.estado,
    })

    if (!reserva) {
      throw new NotFoundException('No existe esa reserva')
    }
    try {
      await this.canchaRepository.save(reserva)
      return {
        codigoRespuesta: 0,
        DescripcionRespuesta:'Exitoso'
      }
    } catch (error) {
      this.handleDBExceptions(error)
    }


  }


  async create(cancha: CreateCanchaDto){
    try {
      await this.canchaRepository.save(cancha)
      return{
        codigoRespuesta:0,
        DescripcionRespuesta: 'Exitoso'
      }
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }



    private handleDBExceptions( error: any ) {
  
      if ( error.code === '23505' )
        throw new BadRequestException(error.detail);
      
    //  this.logger.error(error)
      // console.log(error)
      throw new InternalServerErrorException('Unexpected error, check server logs');
  
    }


}
