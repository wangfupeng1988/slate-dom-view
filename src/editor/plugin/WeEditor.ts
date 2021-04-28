/**
 * @description 自定义 WeEditor 扩展 Editor
 * @author wangfupeng
 */

import { Editor, Element as SlateElement } from 'slate'

export interface IWeEditor extends Editor {
    setContent: (content: SlateElement[]) => void
}

export const WeEditor = {
    setContent(editor: IWeEditor, content: SlateElement[]) {
        editor.setContent(content)
    }
}
