import { createParamDecorator, ExecutionContext, InternalServerErrorException, UseGuards } from '@nestjs/common';


export const GetUser=createParamDecorator(
    (data, ctx:ExecutionContext)=>{
        const req=ctx.switchToHttp().getRequest()
        const user=req.user
         if (!user) {
            throw new InternalServerErrorException('user not found')
        }

        // return user
        return (!data)
          ? user
          : user[data]

        // ? user 
        // : user[data];
      //  return 'hola mundooo'
    }
)