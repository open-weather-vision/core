import AuthException from '#exceptions/auth_exception';
import Session from '#models/session';
import { Role, Roles } from 'owvision-environment/types';
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export type HttpContextWithSession = HttpContext & { session: Session }

export type AuthMiddlewareOptions = {min_role?: Role};

export default class UserAuthenticationMiddleware {
  static disabled = false;
  
  async handle(ctx: HttpContext, next: NextFn, options?: AuthMiddlewareOptions) {
    if(UserAuthenticationMiddleware.disabled) return await next();
    /**
     * Middleware logic goes here (before the next call)
     */
    const auth_token = ctx.request.header("OWVISION_AUTH_TOKEN");

    if(!auth_token){
      throw new AuthException(options?.min_role);
    }
    
    const session = await Session.find(auth_token);

    await session?.load('user');

    if(!session || options?.min_role && session.user.role_index < Roles.indexOf(options.min_role)){
      throw new AuthException(options?.min_role);
    }
    
    (ctx as HttpContextWithSession).session = session;

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}