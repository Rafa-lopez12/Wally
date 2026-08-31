import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../interface/validRoles';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRolGuard } from '../guards/user-rol.guard';

export function Auth(...roles:ValidRoles[]) {
  
    return applyDecorators(
   
        RoleProtected(...roles),
        UseGuards(AuthGuard(), UserRolGuard),

  
    );
}