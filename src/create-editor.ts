/**
 * @description create editor fn
 * @author wangfupeng
 */

import { createEditor, Node } from 'slate'
import { withHistory } from 'slate-history'
import { withDOM } from './editor/with-dom'
import TextArea from './text-area/TextArea'
import Toolbar from './toolbar/Toolbar'
import { TEXTAREA_TO_EDITOR, TOOLBAR_TO_EDITOR, EDITOR_TO_ON_CHANGE, EDITOR_TO_CONFIG } from './utils/weak-maps'
import { IConfig, genConfig } from './config/index'

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

interface IDomSelectors {
    containerId: string
    toolbarId: string
}

/**
 * 创建 wangEditor 实例
 * @param selectors dom selectors
 * @param content initial content
 * @returns editor
 */
function createWangEditor(selectors: IDomSelectors, content?: Node[], config?: IConfig) {
    const { containerId, toolbarId } = selectors
    let editorConfig = genConfig(config || {})

    // 创建实例
    const editor = withHistory(
        withDOM(
            createEditor()
        )
    )
    const textarea = new TextArea(containerId)
    const toolbar = new Toolbar(toolbarId)
    // 绑定关联关系，以方便查找
    TEXTAREA_TO_EDITOR.set(textarea, editor)
    TOOLBAR_TO_EDITOR.set(toolbar, editor)
    EDITOR_TO_CONFIG.set(editor, editorConfig)

    // 初始化内容
    let initialContent: Node[] = content && content.length > 0
        ? content
        : genDefaultInitialContent()
    editor.children = initialContent
    textarea.onEditorChange() // 初始化时触发一次，以便能初始化 textarea DOM 和 selection

    // 绑定 editor onchange
    EDITOR_TO_ON_CHANGE.set(editor, () => {
        // 触发 textarea DOM 变化
        textarea.onEditorChange()

        // 触发 toolbar DOM 变化
        toolbar.onEditorChange()

        // 触发用户配置的 onchange 函数
        if (editorConfig.onChange) editorConfig.onChange()
    })

    return editor
}

export default createWangEditor
