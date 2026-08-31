import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isuuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class ClienteService {

  private readonly logger = new Logger('ClienteService');
  
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>
  ) {}
  
  async create(createClienteDto: CreateClienteDto) {
    try {
      const { password, ...clienteData } = createClienteDto;
      
      const cliente = this.clienteRepository.create({
        ...clienteData,
        password: bcrypt.hashSync(password, 10)
      });
      
      await this.clienteRepository.save(cliente);
      
      // No devolver la password
      delete cliente.password;
      return {
        codigoRespuesta: 0,
        DescripcionRespuesta: 'Exitoso',
      };
      
    } catch (error) {
      console.log(error)
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const clientes= await this.clienteRepository.find({
      select:{
        id: true,
        nombre: true,
        telefono: true
      }
    });
    return {
      clientes: clientes,
      codigoRespuesta: 0,
      DescripcionRespuesta: 'Exitoso'
    }
  }

  async findOne(user:any) {
    let cliente: Cliente;
    
    if (isuuid(user.id)) {
      cliente = await this.clienteRepository.findOneBy({ id: user.id });
    }
    if (!cliente) return null;

    const { password, id, ...result } = cliente;
      return result;
    }
  
  async update(id: string, updateClienteDto: UpdateClienteDto) {
    const { password, ...updateData } = updateClienteDto;
    
    const cliente = await this.clienteRepository.preload({
      id: id,
      ...updateData,
      ...(password && { password: bcrypt.hashSync(password, 10) })
    });
    
    if (!cliente) {
      throw new NotFoundException(`No existe cliente con el id: ${id}`);
    }
    
    try {
      await this.clienteRepository.save(cliente);
      delete cliente.password;
      return {
        codigoRespuesta: 0,
        DescripcionRespuesta:'Exitoso'
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const cliente = await this.clienteRepository.findOne({ where: { id } });
    if (!cliente) {
      throw new NotFoundException(`Cliente con id ${id} no existe`);
    }
    await this.clienteRepository.remove(cliente);
  }

  async changePassword(clienteId: string, changePasswordDto: ChangePasswordDto) {
    try {
      const { currentPassword, newPassword } = changePasswordDto;
      
      // Buscar cliente con password incluido
      const cliente = await this.clienteRepository.findOne({
        where: { id: clienteId },
        select: ['id', 'nombre', 'username', 'password', 'telefono']
      });
  
      if (!cliente) {
        throw new NotFoundException('Cliente no encontrado');
      }
  
      
      const isCurrentPasswordValid = bcrypt.compareSync(currentPassword, cliente.password);
      if (!isCurrentPasswordValid) {
        throw new BadRequestException('La contraseña actual es incorrecta');
      }
  
      // Verificar que la nueva contraseña sea diferente
      const isSamePassword = bcrypt.compareSync(newPassword, cliente.password);
      if (isSamePassword) {
        throw new BadRequestException('La nueva contraseña debe ser diferente a la actual');
      }
  
      // Actualizar contraseña
      cliente.password = bcrypt.hashSync(newPassword, 10);
      await this.clienteRepository.save(cliente);
  
      return {
        message: 'Contraseña actualizada correctamente',
        success: true
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  



  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
