import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Usuario, Cliente]),
    RolesModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        };
      },
    })
  ],
  exports: [UsuarioService, TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
})
export class UsuarioModule {}
