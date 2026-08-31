import { IsNumber, IsPositive, IsString } from "class-validator"

export class CreatePromocionDto {

    @IsString()
    motivo:string

    @IsString()
    descripcion:string

    @IsNumber()
    estado:number
}
