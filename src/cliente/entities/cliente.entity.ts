import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { ClienteController } from '../cliente.controller';
import { Reserva } from '../../reserva/entities/reserva.entity';

@Entity()
export class Cliente {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text')
    nombre: string

    @Column('text')
    username: string

    @Column('text')
    password: string

    @Column('text')
    telefono: string

    @OneToMany(
        ()=>Reserva,
        (reserva)=>reserva.cliente
    )
    reserva: Reserva[]
}
