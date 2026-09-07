import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { ClienteModule } from './cliente/cliente.module';
import { CanchaModule } from './cancha/cancha.module';
import { CommonModule } from './common/common.module';
import { PromocionModule } from './promocion/promocion.module';
import { ReservaModule } from './reserva/reserva.module';
import { RolesModule } from './roles/roles.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          database: process.env.DB_NAME,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          autoLoadEntities: true,
          synchronize: false,
          //ssl: {
          //  rejectUnauthorized: false,
         // },
         ssl: false
        };
      },
    }),
    UsuarioModule,
    ClienteModule,
    CanchaModule,
    CommonModule,
    PromocionModule,
    ReservaModule,
    RolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
