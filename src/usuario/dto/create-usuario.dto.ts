import { IsString, MinLength } from "class-validator"


export class CreateUsuarioDto {

    @IsString()
    @MinLength(3)
    nombre: string

    @IsString()
    username: string

    @IsString()
    password: string

    @IsString()
    telefono: string
   
}
