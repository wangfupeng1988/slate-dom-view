/**
 * @description editor config
 * @author wangfupeng
 */

export interface IConfig {
    onChange?: () => void
    placeholder?: string
    readOnly?: boolean
    autoFocus?: boolean
}

/**
 * 创建默认配置
 */
export function genDefaultConfig(): IConfig {
    return {
        readOnly: false,
        autoFocus: true
    }
}
