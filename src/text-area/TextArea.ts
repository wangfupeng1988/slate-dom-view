/**
 * @description text-area class
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { throttle } from 'lodash-es'

import $, { Dom7Array } from '../utils/dom'
import { TEXTAREA_TO_EDITOR } from '../utils/weak-maps'
import { IDomEditor } from '../editor/dom-editor'
import updateView from './updateView'
import { IConfig } from '../config/index'
import { DOMElement } from '../utils/dom'
import { editorSelectionToDOM } from './syncSelection'

let ID = 1

class TextArea {
    id: number
    $textAreaContainer: Dom7Array
    config: IConfig
    isComposing: boolean = false
    isUpdatingSelection: boolean = false
    private latestElement: DOMElement | null = null

    constructor(textAreaContainerId: string, config: IConfig) {
        // id 不能重复
        this.id = ID++

        this.config = config

        // 初始化 dom
        const $textAreaContainer  = $(`#${textAreaContainerId}`)
        this.$textAreaContainer = $textAreaContainer

        // 监听 selection change
        this.observeSelectionChange()
    }

    private getEditorInstance(): IDomEditor {
        const editor = TEXTAREA_TO_EDITOR.get(this)
        if (editor == null) throw new Error('Can not ge editor instance')
        return editor
    }

    /**
     * editor.onchange 时触发
     */
    onEditorChange() {
        const editor = this.getEditorInstance()

        // 更新 DOM
        updateView(this, editor)

        // 同步选区
        editorSelectionToDOM(this, editor)
    }

    private observeSelectionChange() {
        const onDOMSelectionChange = throttle(() => {
            const editor = this.getEditorInstance()

            // const { activeElement } = window.document
            const domSelection = window.getSelection()

            // 未找到选区
            if (!domSelection) {
                return Transforms.deselect(editor)
            }
            const { anchorNode, focusNode } = domSelection
            if (anchorNode == null || focusNode == null) {
                return Transforms.deselect(editor)
            }

            // 判断选区是否在 text-area 之内
            // const textAreaContainer = this.$textAreaContainer[0]
            // const anchorNodeParents = toArray($(anchorNode).parents())
            // const focusNodeParents = toArray($(focusNode).parents())
            // if (!anchorNodeParents.includes(textAreaContainer) || !focusNodeParents.includes(textAreaContainer)) {
            //     return Transforms.deselect(editor)
            // }

            // TODO console.log('select editor')

        }, 100)

        window.document.addEventListener('selectionchange', onDOMSelectionChange)
        // TODO editor 销毁时，解绑事件
    }
}

export default TextArea
