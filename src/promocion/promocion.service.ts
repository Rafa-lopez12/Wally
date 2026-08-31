import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePromocionDto } from './dto/create-promocion.dto';
import { UpdatePromocionDto } from './dto/update-promocion.dto';
import { Repository } from 'typeorm';
import { Promocion } from './entities/promocion.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PromocionService {
  
  private readonly logger = new Logger('PromocionService');

  constructor(
    @InjectRepository(Promocion)
    private readonly promocionRepository: Repository<Promocion>

  ){}

  async create(createPromocionDto: CreatePromocionDto) {
    try {
      const promocion=this.promocionRepository.create(createPromocionDto)
      await this.promocionRepository.save(promocion)
      return{
        codigoRespuesta: 0,
        DescripcionRespuesta:'Exitoso'
      }

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  findAll() {
    const promociones=this.promocionRepository.find()
    return promociones
  }


  async update(id: number, updatePromocionDto: UpdatePromocionDto) {
    const promocion=await this.promocionRepository.preload({
      id:id,
      ...updatePromocionDto,
    })

    if (!promocion) {
      throw new NotFoundException(`No existe promocion con el id: ${ id } `)
    }

    try {
      await this.promocionRepository.save(promocion)
      return {
        codigoRespuesta: 0,
        DescripcionRespuesta:'Exitoso'
      }
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async promocioView(){
    const promocion = await this.promocionRepository.find({
      select:{
        motivo:true,
        descripcion:true
      },
      where:{
        estado:1
      }
    })
    return promocion
  }

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
