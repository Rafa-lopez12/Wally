import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Usuario } from "../entities/usuario.entity";
import { Cliente } from "../../cliente/entities/cliente.entity";
import { JwtPayload } from "../interface/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
        @InjectRepository(Cliente)
        private readonly clienteRepository: Repository<Cliente>,
        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayload & { userType?: string }): Promise<Usuario | Cliente> {
        const { id, userType } = payload;

        if (userType === 'cliente') {
            const cliente = await this.clienteRepository.findOneBy({ id });
            if (!cliente) {
                throw new UnauthorizedException('Token not valid');
            }
            return cliente;
        } else {
            // Por defecto buscar en usuarios
            const user = await this.usuarioRepository.findOneBy({ id });
            if (!user) {
                throw new UnauthorizedException('Token not valid');
            }
            return user;
        }
    }
}