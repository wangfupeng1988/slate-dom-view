/**
 * @description toolbar class
 * @author wangfupeng
 */

import { debounce } from 'lodash-es'
import $, { Dom7Array } from '../utils/dom'
import { TOOLBAR_TO_EDITOR, TOOLBAR_BUTTON_TO_EDITOR } from '../utils/weak-maps'
import { IDomEditor } from '../editor/dom-editor'
import { TOOL_BUTTON_LIST } from './buttons/index'
import { promiseResolveThen } from '../utils/util'

class Toolbar {
    $toolbar: Dom7Array

    constructor(toolbarId: string) {
        this.$toolbar = $(`#${toolbarId}`)

        // 注册 toolbar 按钮 - 异步，否则拿不到 editor
        promiseResolveThen(() => { this.registerButtons() })
    }

    private registerButtons() {
        const editor = this.getEditorInstance()
        const $toolbar = this.$toolbar

        TOOL_BUTTON_LIST.forEach(button => {
            // 添加到 DOM
            $toolbar.append(button.$elem)

            // 绑定 button 和 editor 关系
            TOOLBAR_BUTTON_TO_EDITOR.set(button, editor)
        })
    }

    onEditorChange = debounce(() => {
        TOOL_BUTTON_LIST.forEach(button => {
            button.toggleActive()
        })
    }, 100)

    private getEditorInstance(): IDomEditor {
        const editor = TOOLBAR_TO_EDITOR.get(this)
        if (editor == null) throw new Error('Can not get editor instance')
        return editor
    }
}

export default Toolbar
