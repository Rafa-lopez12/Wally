import { IsPositive, IsString } from "class-validator";


export class CreateCanchaDto{

    @IsString()
    cancha:string

    @IsPositive()
    estado:number

}