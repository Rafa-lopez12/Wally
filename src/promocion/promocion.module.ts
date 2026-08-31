import { Module } from '@nestjs/common';
import { PromocionService } from './promocion.service';
import { PromocionController } from './promocion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promocion } from './entities/promocion.entity';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  controllers: [PromocionController],
  providers: [PromocionService],
  imports: [TypeOrmModule.forFeature([Promocion]), UsuarioModule],
  exports: [TypeOrmModule, PromocionService]
})
export class PromocionModule {}
