/**
 * @description editor config
 * @author wangfupeng
 */

import { Range, NodeEntry } from 'slate'

export interface IConfig {
    onChange?: () => void
    placeholder?: string
    readOnly?: boolean
    autoFocus?: boolean
    decorate?: (nodeEntry: NodeEntry) => Range[]
}

/**
 * 默认配置
 */
function getDefaultConfig(): IConfig {
    return {
        readOnly: false,
        autoFocus: true,
        decorate: () => []
    }
}

// 生成配置
export function genConfig(userConfig: IConfig): IConfig {
    // 默认配置
    const defaultConfig = getDefaultConfig()

    // 合并默认配置，和用户配置
    return {
        ...defaultConfig,
        ...userConfig
    }
}
