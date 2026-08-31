import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role)
    private readonly rolRepository:Repository<Role>
  ){}

  async create(createRoleDto: CreateRoleDto) {
    try {

      const rol=this.rolRepository.create(createRoleDto)
      await this.rolRepository.save(rol)
      return rol

    } catch (error) {
      console.log(error)
    }
  }

  findAll() {
    return this.rolRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
