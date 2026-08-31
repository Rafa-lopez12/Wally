import { Module } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { ClienteModule } from '../cliente/cliente.module';
import { PromocionModule } from '../promocion/promocion.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { CanchaModule } from '../cancha/cancha.module';
import { ClienteService } from '../cliente/cliente.service';
import { UsuarioService } from '../usuario/usuario.service';
import { CanchaService } from '../cancha/cancha.service';
import { PromocionService } from '../promocion/promocion.service';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [ReservaController],
  providers: [ReservaService, ClienteService, UsuarioService, CanchaService, PromocionService],
  imports: [TypeOrmModule.forFeature([Reserva]), ClienteModule, PromocionModule, UsuarioModule, CanchaModule, RolesModule]
})
export class ReservaModule {}
