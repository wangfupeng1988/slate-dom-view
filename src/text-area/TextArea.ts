/**
 * @description text-area class
 * @author wangfupeng
 */

import { throttle } from 'lodash-es'
import $, { Dom7Array } from '../utils/dom'
import { TEXTAREA_TO_EDITOR } from '../utils/weak-maps'
import { IDomEditor } from '../editor/dom-editor'
import updateView from './updateView'
import { IConfig } from '../config/index'
import { DOMElement } from '../utils/dom'
import { editorSelectionToDOM, DOMSelectionToEditor } from './syncSelection'
import { promiseResolveThen } from '../utils/util'

let ID = 1

class TextArea {
    id: number
    $textAreaContainer: Dom7Array
    config: IConfig
    isComposing: boolean = false
    isUpdatingSelection: boolean = false
    latestElement: DOMElement | null = null

    constructor(textAreaContainerId: string, config: IConfig) {
        // id 不能重复
        this.id = ID++

        this.config = config

        // 初始化 dom
        const $textAreaContainer  = $(`#${textAreaContainerId}`)
        this.$textAreaContainer = $textAreaContainer

        // 监听 selection change
        window.document.addEventListener('selectionchange', this.onDOMSelectionChange)
        // TODO editor 销毁时，解绑事件
    }

    private getEditorInstance(): IDomEditor {
        const editor = TEXTAREA_TO_EDITOR.get(this)
        if (editor == null) throw new Error('Can not ge editor instance')
        return editor
    }

    private onDOMSelectionChange = throttle(() => {
        const editor = this.getEditorInstance()
        DOMSelectionToEditor(this, editor)
    }, 100)

    /**
     * editor.onchange 时触发（涉及 DOM 操作，节流）
     */
    onEditorChange = throttle(() => {
        const editor = this.getEditorInstance()

        // 更新 DOM
        updateView(this, editor)

        // 同步选区（异步，否则拿不到 DOM 渲染结果，vdom）
        promiseResolveThen(() => {
            editorSelectionToDOM(this, editor)
        })
    }, 100)
}

export default TextArea
