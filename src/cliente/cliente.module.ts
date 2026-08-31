import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  controllers: [ClienteController],
  providers: [ClienteService],
  imports:[
    TypeOrmModule.forFeature([Cliente]),
    UsuarioModule
  ],

  exports:[ClienteService,TypeOrmModule]
})
export class ClienteModule {}
