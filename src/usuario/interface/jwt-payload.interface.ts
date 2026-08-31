

export interface JwtPayload{

    id: string,
    nombre:string,
    userType?: 'usuario' | 'cliente';
}