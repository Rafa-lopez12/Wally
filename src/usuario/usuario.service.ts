import { BadRequestException, ConsoleLogger, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import * as bycript from 'bcrypt';
import { LoginUsuarioDto } from './dto/login-user.dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../roles/entities/role.entity';
import { LoginResponse } from './interface/login-response.interface';
import { Cliente } from '../cliente/entities/cliente.entity';


@Injectable()
export class UsuarioService {

  constructor(

    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    @InjectRepository(Role)
    private readonly rolRepository: Repository<Role>,
    
    @InjectRepository(Cliente)
    private readonly clienteRepository:Repository<Cliente>,

    private readonly jwtService: JwtService


  ){}
  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      const {password,...userData}=createUsuarioDto
      //const rol=await this.rolRepository.findOneBy()
      const rol={
        id:1,
        rol:'usuario'
      }
      const user=this.userRepository.create({
        ...userData,
        password: bycript.hashSync(password, 10),
        rol,

      })
    //  this.userRepository.save(user)
    //const user=this.userRepository.create(createUsuarioDto)
      await this.userRepository.save(user)
      return {
        codigoRepuesta: 0,
        descripcionRespuesta: 'Exitoso',
        token: this.getJwtToken({id: user.id, nombre: user.nombre})
      }

    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async login(unifiedLoginDto: LoginUsuarioDto) {
    const { password, username } = unifiedLoginDto;
    // Primero buscar en usuarios
    const user = await this.userRepository.findOne({
      where: { username },
      select: { username: true, password: true, nombre: true, id: true, telefono: true },
      relations: ['rol']
    });

    if (user) {
      // Verificar contraseña del usuario
      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Credenciales incorrectas');
      }

      return {
        codigoRespuesta: 0,
        DescripcionRespuesta: 'Exitoso',
        token: this.getJwtToken({id: user.id, nombre: user.nombre, userType: 'usuario'})
      };
    }

    // Si no se encuentra en usuarios, buscar en clientes
    const cliente = await this.clienteRepository.findOne({
      where: { username }
    });

    if (cliente) {
      // Verificar contraseña del cliente
      if (!bcrypt.compareSync(password, cliente.password)) {
        throw new UnauthorizedException('Credenciales incorrectas');
      }

      return {
        codigoRespuesta: 0,
        DescripcionRespuesta: 'Exitoso',
        token: this.getJwtToken({id: cliente.id, nombre: cliente.nombre , userType: 'cliente'})
      };
    }

    throw new UnauthorizedException('Credenciales incorrectas');
  }

  async checkStatus(user: Usuario | Cliente) {
    // Verificar si es un Usuario (tiene propiedad 'rol')
    if ('rol' in user) {
      const usuario = user as Usuario;
      return {
        nombre: usuario.nombre,
        token: this.getJwtToken({
          id: usuario.id, 
          nombre: usuario.nombre,
          userType: 'usuario'
        })
      };
    } else {
      // Es un Cliente
      const cliente = user as Cliente;
      return {
        nombre: cliente.nombre,
        token: this.getJwtToken({
          id: cliente.id, 
          nombre: cliente.nombre, 
          userType: 'cliente'
        })
      };
    }
  }


  findAll() {
    const user=this.userRepository.find()
    return user
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }

  private getJwtToken(payload: JwtPayload){
    const token=this.jwtService.sign(payload)
    return token
  }

  private handleDBErrors( error: any ): never {


    if ( error.code === '23505' ) 
      throw new BadRequestException( error.detail );

    throw new InternalServerErrorException('Please check server logs');

  }
}
