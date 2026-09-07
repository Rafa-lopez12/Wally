import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { Between, DataSource, In, Like, MoreThan, Repository } from 'typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { Cancha } from '../cancha/entities/cancha.entity';
import { Promocion } from '../promocion/entities/promocion.entity';

@Injectable()
export class ReservaService {

  private readonly logger = new Logger('SugerenciaService');

  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository:Repository<Reserva>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository:Repository<Usuario>,

    @InjectRepository(Cliente)
    private readonly clienteRepository:Repository<Cliente>,

    @InjectRepository(Cancha)
    private readonly canchaRepository:Repository<Cancha>,

    @InjectRepository(Promocion)
    private readonly promocionRepository:Repository<Promocion>,

    private readonly dataSource: DataSource
  ){}

  async create(createReservaDto: CreateReservaDto) {
    
    const usuario = createReservaDto.persona 
    ? await this.usuarioRepository.findOneBy({ id: createReservaDto.persona }) 
    : null;
    const cliente = createReservaDto.persona ? await this.clienteRepository.findOneBy({ id: createReservaDto.persona }) : null;
    const cancha = await this.canchaRepository.findOneBy({cancha: createReservaDto.cancha});
    if ((!cliente && !usuario)|| !cancha ) {
      throw new BadRequestException('Datos inválidos para la reserva');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {

    await queryRunner.manager.save(Reserva,{
        fecha_hora_inicio: createReservaDto.fecha_hora_inicio,
        fecha_hora_fin: createReservaDto.fecha_hora_fin,
        nombre:createReservaDto.nombre,
        usuario,
        cliente,
        cancha
      });
      await queryRunner.commitTransaction();
      return {
        codigoRespuesta:0,
        DescripcionRespuesta:'Reserva creada'
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBExceptions(error);
    }finally{
      await queryRunner.release();
    }
  }

  findAll() {
    const reservas=this.reservaRepository.find()
    return reservas
  }

  async findCountReservas(user: any) {
    if (!user || !user.id) {
      return 0;
    }
  
    const reservas = await this.reservaRepository.count({
      where: {
        cliente: {
          id: user.id
        }
      }
    });
  
    return reservas;
  }

  async findRerservaPen(user:any) {
    if (!user || !user.id) {
      return 0;
    }
  
    const reservas = await this.reservaRepository.find({
      
      where: {
        cliente: {
          id: user.id
        },
        estado: 1
      }
    });
  
    return reservas;
  }

  async update(id: number, updateReservaDto: UpdateReservaDto) {
    
    const cancha = await this.canchaRepository.findOneBy({cancha: updateReservaDto.cancha})
    
    if (!cancha ) {
      throw new BadRequestException('No existe la cancha');
    }
    
    const reserva=await this.reservaRepository.preload({
      id:id,
      monto:updateReservaDto.monto ?? 0 ,
      fecha_hora_inicio:updateReservaDto.fecha_hora_inicio,
      fecha_hora_fin:updateReservaDto.fecha_hora_fin,
      cancha: cancha,
      estado: updateReservaDto.estado

    })

    if (!reserva) {
      throw new NotFoundException('No existe esa reserva')
    }
    try {
      await this.reservaRepository.save(reserva)
      return {
        codigoRespuesta:0,
        DescripcionRespuesta:'Exitoso'
      }
    } catch (error) {
      this.handleDBExceptions(error)
    }


  }

  async remove(id: number) {
    const reserva= await this.reservaRepository.findOne({where:{id}})
    if (!reserva) {
      throw new NotFoundException('No existe esa reserva')
    }

    await this.reservaRepository.remove(reserva)
  }

  getReservas(){
    return  this.reservaRepository.find({
      select:{
        id:true,
        fecha_hora_inicio:true,
        fecha_hora_fin:true,
        nombre:true,
        estado:true,
        cancha: {
          id: true,
          cancha : true,
        },
        cliente: {
          id: true,
          nombre: true
        }
      },
      where:{
        estado: In([1, 2])
      },
      relations: ['cancha','cliente']
    })
  }

  async getReservasByClient(user:any) {
    try {
      const reservas = await this.reservaRepository.find({
        select:{
          fecha_hora_inicio:true,
          fecha_hora_fin:true,
          estado:true,
          nombre:true,
          monto:true,
          cancha:{
            cancha:true
          }
        },
        where: { cliente: { id: user.id } },
        relations: ['cancha'],
        order: { fecha_hora_inicio: 'DESC' }
 });
      return reservas.map(reserva => ({
        id: reserva.id,
        monto: reserva.monto,
        fecha_hora_inicio: reserva.fecha_hora_inicio,
        fecha_hora_fin: reserva.fecha_hora_fin,
        cancha: reserva.cancha.cancha,
        usuario: reserva.usuario ? reserva.nombre : null,
        estado: reserva.estado
      }));
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  
  async updateReserva(id: number, updateReservaDto: UpdateReservaDto, user: any) {
    // 1. Obtener la reserva actual cargando la relación del cliente
    const reservaExistente = await this.reservaRepository.findOne({
      where: { id },
      relations: ['cliente', 'cancha'],
    });
  
    if (!reservaExistente) {
      throw new NotFoundException(`No existe la reserva con id ${id}`);
    }
  
    // 2. Validar permisos: Si no es 'Usuario' (es decir, es 'Cliente'), verificar pertenencia
    const esUsuarioSistema = !!user.rol;
  
    if (!esUsuarioSistema) {
      // Es un Cliente: comprobar que sea el dueño de la reserva
      if (!reservaExistente.cliente || reservaExistente.cliente.id !== user.id) {
        throw new ForbiddenException('No tienes permisos para modificar esta reserva');
      }
    }
  
    // 3. Manejo opcional de Cancha (solo si viene en el DTO)
    let cancha = reservaExistente.cancha;
    if (updateReservaDto.cancha) {
      const nuevaCancha = await this.canchaRepository.findOneBy({ 
        cancha: updateReservaDto.cancha 
      });
      
      if (!nuevaCancha) {
        throw new BadRequestException('No existe la cancha especificada');
      }
      cancha = nuevaCancha;
    }
  
    // 4. Preparar los cambios con preload manteniendo valores previos
    const reserva = await this.reservaRepository.preload({
      id: id,
      monto: updateReservaDto.monto ?? reservaExistente.monto,
      fecha_hora_inicio: updateReservaDto.fecha_hora_inicio ?? reservaExistente.fecha_hora_inicio,
      fecha_hora_fin: updateReservaDto.fecha_hora_fin ?? reservaExistente.fecha_hora_fin,
      estado: updateReservaDto.estado ?? reservaExistente.estado,
      cancha: cancha,
    });
  
    try {
      await this.reservaRepository.save(reserva);
      return {
        codigoRespuesta: 0,
        DescripcionRespuesta: 'Exitoso',
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }


  async reporteMonto(tipo: 'diario' | 'mensual', fecha: string) {
    this.validarFecha(tipo, fecha);
  
    const patron = `${fecha}%`;
  
    const resultado = await this.reservaRepository
      .createQueryBuilder('reserva')
      .select('COALESCE(SUM(reserva.monto), 0)', 'totalMonto')
      .addSelect('COUNT(reserva.id)', 'cantidadReservas')
      .where('reserva.fecha_hora_inicio LIKE :patron', { patron })
      .andWhere('reserva.estado = :estado', { estado: 2 }) // solo reservas finalizadas
      .getRawOne();
  
    return {
      tipo,
      fecha,
      totalMonto: Number(resultado.totalMonto),
      cantidadReservas: Number(resultado.cantidadReservas),
    };
  }
  
  private validarFecha(tipo: string, fecha: string) {
    if (tipo !== 'diario' && tipo !== 'mensual') {
      throw new BadRequestException('El parámetro "tipo" debe ser "diario" o "mensual"');
    }
  
    const patronDiario = /^\d{4}-\d{2}-\d{2}$/;   // 2026-08-16
    const patronMensual = /^\d{4}-\d{2}$/;         // 2026-08
  
    if (tipo === 'diario' && !patronDiario.test(fecha)) {
      throw new BadRequestException('Para tipo "diario", "fecha" debe tener formato YYYY-MM-DD');
    }
    if (tipo === 'mensual' && !patronMensual.test(fecha)) {
      throw new BadRequestException('Para tipo "mensual", "fecha" debe tener formato YYYY-MM');
    }
  }

  // en reserva.service.ts

  async reservasParaMensaje(fecha: string) {
    const patronDiario = /^\d{4}-\d{2}-\d{2}$/;
    if (!patronDiario.test(fecha)) {
      throw new BadRequestException('"fecha" debe tener formato YYYY-MM-DD');
    }

    const patron = `${fecha}%`;

    const reservas = await this.reservaRepository.find({
      select: {
        nombre: true,
        fecha_hora_inicio: true,
        fecha_hora_fin: true,
        cancha: { cancha: true },
      },
      where: {
        fecha_hora_inicio: Like(patron),
        estado: In([1, 2]), // se excluyen las canceladas (estado 0)
      },
      relations: ['cancha'],
      order: { fecha_hora_inicio: 'ASC' },
    });

    return reservas.map((r) => ({
      nombre: r.nombre,
      cancha: r.cancha.cancha,
      fecha_hora_inicio: r.fecha_hora_inicio,
      fecha_hora_fin: r.fecha_hora_fin,
    }));
  }
    

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }

  


}
