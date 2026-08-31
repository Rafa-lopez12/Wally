import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ConsoleLogger, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Usuario } from '../entities/usuario.entity';
import { META_ROLS } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRolGuard implements CanActivate {
  
  constructor(
    private readonly reflector:Reflector
  ){}
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const validRoles: string[]=this.reflector.get(META_ROLS, context.getHandler())
    if (!validRoles) {
      return true
    }

    const req=context.switchToHttp().getRequest()
    const user=req.user as Usuario

    if (!user) {
      throw new BadRequestException('user not found (rol)')
    }
    if (validRoles.includes(user.rol.rol)) {
      return true;
    }


    throw new ForbiddenException(`user ${ user.nombre} need a valid roles {${validRoles}}`)
    
  }
}
