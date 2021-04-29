/**
 * @description text-area class
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { throttle, toArray } from 'lodash-es'
import $, { Dom7Array } from '../utils/dom'
import { TEXTAREA_TO_EDITOR } from '../utils/weak-maps'
import { IDomEditor } from '../editor/dom-editor'
import patchView from './patchView'

let ID = 1

class TextArea {
    id: number
    $textAreaContainer: Dom7Array

    constructor(textAreaContainerId: string) {
        // id 不能重复
        this.id = ID++

        // 初始化 dom
        const $textAreaContainer  = $(`#${textAreaContainerId}`)
        this.$textAreaContainer = $textAreaContainer

        // 监听 selection change
        this.observeSelectionChange()
    }

    private getEditorInstance(): IDomEditor | null {
        const editor = TEXTAREA_TO_EDITOR.get(this)
        return editor || null
    }

    /**
     * editor.onchange 时触发
     */
    onEditorChange() {
        this.updateView()
    }

    /**
     * 更新视图
     */
    private updateView() {
        // 获取 editor
        const editor = this.getEditorInstance()
        if (editor == null) return

        patchView(this, editor)
    }

    private observeSelectionChange() {
        const onDOMSelectionChange = throttle(() => {
            const editor = this.getEditorInstance()
            if (editor == null) return

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
