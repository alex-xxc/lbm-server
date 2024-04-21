import { ApiProperty } from '@nestjs/swagger'

export class CreateOperalogDto {
    @ApiProperty({ description: '系统菜单' })
    readonly systemMenu: string

    @ApiProperty({ description: '操作模块' })
    readonly operaModule: string

    @ApiProperty({ description: '操作人员' })
    readonly operaName: string

    @ApiProperty({ description: '操作地址' })
    readonly operaIp: string

    @ApiProperty({ description: '操作状态' })
    readonly status: string
}
