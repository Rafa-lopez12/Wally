import { IsDateString, IsNumber, IsOptional, IsPositive, IsString,} from "class-validator";

export class CreateReservaDto {

    @IsPositive()
    @IsOptional()
    monto?:number;

    @IsString()
    fecha_hora_inicio:string;

    @IsString()
    fecha_hora_fin:string;

    @IsString()
    @IsOptional()
    persona?:string;

    @IsString()
    nombre:string

    @IsString()
    cancha:string;

    @IsNumber()
    
    estado:number


}
