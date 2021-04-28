/**
 * @description 自定义 editor 插件，扩展 editor
 * @author wangfupeng
 */

import { Editor, Element as SlateElement } from 'slate'
import { IWeEditor } from './WeEditor'
import { EDITOR_TO_TEXTAREA } from '../../utils/weak-map'

function triggerViewUpdate(e: IWeEditor) {
    const textArea = EDITOR_TO_TEXTAREA.get(e)
    textArea!.updateView()
}

// 插件
export const withWe = <T extends Editor>(editor: T) => {
    const newEditor = editor as T & IWeEditor
    const { onChange } = newEditor

    // 扩展 setContent API
    newEditor.setContent = (content: SlateElement[]) => {
        // 修改内容
        newEditor.children = content

        // 更新视图
        triggerViewUpdate(newEditor)

        // TODO 重新定位 selection ？？？
    }

    // 重写 onchange API
    newEditor.onChange = () => {
        triggerViewUpdate(newEditor)
        onChange()
    }

    // 最后返回 实例
    return newEditor
}
