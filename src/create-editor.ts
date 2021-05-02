/**
 * @description create editor fn
 * @author wangfupeng
 */

import { createEditor, Node } from 'slate'
import { withHistory } from 'slate-history'
import { withDOM } from './editor/with-dom'
import TextArea from './text-area/TextArea'
import { TEXTAREA_TO_EDITOR, EDITOR_TO_ON_CHANGE } from './utils/weak-maps'
import { IConfig, genDefaultConfig } from './config/index'

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

function getConfig(userConfig: IConfig): IConfig {
    const defaultConfig = genDefaultConfig()
    return {
        ...defaultConfig,
        ...userConfig
    }
}

/**
 * 创建 wangEditor 实例
 * @param containerId textarea container elem id
 * @param content initial content
 * @returns editor
 */
function createWangEditor(containerId: string, content?: Node[], config?: IConfig) {
    // 生成配置
    let editorConfig = getConfig(config || {})

    // 创建实例
    const editor = withHistory(
        withDOM(
            createEditor()
        )
    )
    const textarea = new TextArea(containerId, editorConfig)
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
        console.log('--- editor changed ---', editor.selection)

        // 触发 textarea DOM 变化
        textarea.onEditorChange()

        // 触发用户配置的 onchange 函数
        if (editorConfig.onChange) editorConfig.onChange()
    })

    return editor
}

export default createWangEditor
