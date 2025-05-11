import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../user/entities/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request?.user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can access this endpoint');
    }
    return true;
  }
}
