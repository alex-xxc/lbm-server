import { ApiProperty } from '@nestjs/swagger'

export class CreateLoginlogDto {
    @ApiProperty({ description: '用户名称' })
    readonly userName: string

    @ApiProperty({ description: '登录IP' })
    readonly loginIp: string

    @ApiProperty({ description: '登录地点' })
    readonly loginAddress: string

    @ApiProperty({ description: '登录浏览器' })
    readonly loginBrowser: string

    @ApiProperty({ description: '登录系统' })
    readonly loginSystem: string

    @ApiProperty({ description: '登录状态' })
    readonly status: string
}
