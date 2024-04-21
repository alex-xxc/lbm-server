import { CanActivate, Inject, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { pathToRegexp } from 'path-to-regexp'

import { ALLOW_ANON } from '../decorators/allow-anon.decorator'
import { ALLOW_NO_PERM } from '../decorators/perm.decorator'

import { PermService } from '../../system/perm/perm.service'
import { OperalogService } from '../../system/operalog/operalog.service'
import { UserType } from '../enums/common.enum'

@Injectable()
export class OperalogGuard implements CanActivate {
  private globalWhiteList = []
  constructor(
    private readonly reflector: Reflector,
    @Inject(OperalogService)
    private readonly operalogService: OperalogService,
    private readonly config: ConfigService,
  ) {
    this.globalWhiteList = [].concat(this.config.get('operalog.router.whitelist') || [])
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // 首先 无 token 的 是不需要 对比权限
    const allowAnon = this.reflector.getAllAndOverride<boolean>(ALLOW_ANON, [ctx.getHandler(), ctx.getClass()])
    if (allowAnon) return true
    // 全局配置
    const req = ctx.switchToHttp().getRequest();
  }
}
