import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Reserva } from '../../reserva/entities/reserva.entity';

@Entity()
export class Cancha {

    @PrimaryGeneratedColumn('increment')
    id:number

    @Column('text')
    cancha: string

    @Column('numeric')
    estado: number

    @OneToMany(
        ()=>Reserva,
        (reserva)=>reserva.cancha
    )
    reserva:Reserva[]

}
