import { Cliente } from "../../cliente/entities/cliente.entity";
import { Usuario } from "../../usuario/entities/usuario.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cancha } from '../../cancha/entities/cancha.entity';
import { Promocion } from '../../promocion/entities/promocion.entity';

@Entity()
export class Reserva {

    @PrimaryGeneratedColumn('increment')
    id:number

    @Column('numeric', {
        default: 0,
        nullable: true,
      })
    monto?: number;

    @Column("text")
    nombre:string

    @Column("text")
    fecha_hora_inicio: string

    @Column("text")
    fecha_hora_fin: string

    @Column('numeric', {
        default:1,
        nullable: false
    })
    estado:number

    @ManyToOne(
        ()=>Usuario,
        (usuario)=>usuario.id,
        {  nullable: true }
    )
    usuario?:Usuario

    @ManyToOne(
        ()=>Cliente,
        (cliente)=>cliente.id,
        {  nullable: true }
    )
    cliente?:Cliente

    @ManyToOne(
        ()=>Cancha,
        (cancha)=>cancha.id,
    )
    cancha:Cancha


}
