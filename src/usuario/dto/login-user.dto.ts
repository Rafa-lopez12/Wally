import {  IsString, MinLength } from "class-validator"


export class LoginUsuarioDto {

    @IsString()
    username: string

    @IsString()
    @MinLength(4)
    password: string


}