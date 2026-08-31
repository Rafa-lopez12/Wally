import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interface/validRoles';

export const META_ROLS='roles'

export const RoleProtected = (...args: ValidRoles[]) => {
    
    
    return SetMetadata(META_ROLS, args)
};
