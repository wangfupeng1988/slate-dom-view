/**
 * @description 自定义 editor 插件，扩展 editor
 * @author wangfupeng
 */

import { Editor, Element as SlateElement } from 'slate'
import { IWeEditor } from './WeEditor'
import emitter from '../emitter'

/**
 * 触发 editor onchange 事件
 * @param editor editor
 */
function triggerChangeEvent(editor: IWeEditor) {
    emitter.emit('editor:change', editor)
}

export const withWe = <T extends Editor>(editor: T) => {
    const e = editor as T & IWeEditor
    const { onChange } = e

    // 扩展 setContent
    e.setContent = (content: SlateElement[]) => {
        editor.children = content // 修改内容
        triggerChangeEvent(e)

        // TODO 重新定位 selection ？？？
    }

    // 修改 onchange
    e.onChange = () => {
        triggerChangeEvent(e)
        onChange()
    }

    // 最后返回 实例
    return e
}
