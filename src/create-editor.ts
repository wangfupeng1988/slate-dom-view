/**
 * @description create editor fn
 * @author wangfupeng
 */

import { createEditor, Element } from 'slate'
import { withDOM } from './editor/with-dom'
import TextArea from './text-area/TextArea'
import { TEXTAREA_TO_EDITOR, EDITOR_TO_TEXTAREA } from './utils/weak-maps'

/**
 * 创建 wangEditor 实例
 * @param containerId textarea container elem id
 * @param content initial content
 * @returns editor
 */
function createWangEditor(containerId: string, content?: Element[]) {
    const editor = withDOM(createEditor())
    const textarea = new TextArea(containerId)

    // 建立关联关系，以便相互访问
    TEXTAREA_TO_EDITOR.set(textarea, editor)
    EDITOR_TO_TEXTAREA.set(editor, textarea)

    // 初始化内容
    if (content && content.length > 0) {
        editor.children = content
        textarea.updateView()
    }

    return editor
}

export default createWangEditor
