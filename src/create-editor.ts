/**
 * @description create editor fn
 * @author wangfupeng
 */

import { createEditor, Node } from 'slate'
import { withDOM } from './editor/with-dom'
import TextArea from './text-area/TextArea'
import { TEXTAREA_TO_EDITOR, EDITOR_TO_ON_CHANGE } from './utils/weak-maps'

/**
 * 获取默认的初始化内容
 */
function genDefaultInitialContent() {
    return [
        {
            type: 'paragraph',
            children: [ { text: '' } ]
        }
    ]
}

/**
 * 创建 wangEditor 实例
 * @param containerId textarea container elem id
 * @param content initial content
 * @returns editor
 */
function createWangEditor(containerId: string, content?: Node[]) {
    const editor = withDOM(createEditor())
    const textarea = new TextArea(containerId)

    // 绑定 textarea 到 editor ，以便在 textarea 中可以访问到 editor
    TEXTAREA_TO_EDITOR.set(textarea, editor)

    // 初始化内容
    let initialContent: Node[] = content && content.length > 0
        ? content
        : genDefaultInitialContent()
    editor.children = initialContent
    textarea.onEditorChange() // 初始化时触发一次，以便能初始化 textarea DOM 和 selection

    // 绑定 editor onchange
    EDITOR_TO_ON_CHANGE.set(editor, () => {
        textarea.onEditorChange()

        // TODO 触发用户配置的 onchange 函数
    })

    return editor
}

export default createWangEditor
