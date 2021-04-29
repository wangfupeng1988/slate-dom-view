/**
 * @description text-area class
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { throttle, toArray } from 'lodash-es'
import { h, VNode } from 'snabbdom'
import $, { Dom7Array } from '../utils/dom'
import { genRandomStr } from '../utils/util'
import { node2Vnode } from '../formats/index'
import { genPatchFn } from '../utils/vdom'
import { TEXTAREA_TO_EDITOR } from '../utils/weak-maps'
import { IDomEditor } from '../editor/dom-editor'

class TextArea {
    $textAreaContainer: Dom7Array
    textAreaId: string = genRandomStr('text-area')
    $textArea: Dom7Array
    private patchFn: Function
    private isFirstPatchView: boolean = true
    private curVnode: VNode | null = null

    constructor(textAreaContainerId: string) {
        // 初始化 dom
        const $textAreaContainer  = $(`#${textAreaContainerId}`)
        const $textArea = $(`<div id="${this.textAreaId}" contenteditable="true" data-slate-editor></div>`)
        $textAreaContainer.append($textArea)
        this.$textAreaContainer = $textAreaContainer
        this.$textArea = $textArea

        // 初始化 vdom patch 函数 
        this.patchFn = genPatchFn()

        // 监听 selection change
        this.observeSelectionChange()
    }

    private getEditorInstance(): IDomEditor | null {
        const editor = TEXTAREA_TO_EDITOR.get(this)
        return editor || null
    }

    /**
     * 初始化 textArea vnode 【注意】需要用到和 DOM 一样的 id 和 attr
     * @returns vnode
     */
    private genTextAreaVnode(): VNode {
        return h(`div#${this.textAreaId}`, {
            props: { contenteditable: true },
            datasets: { slateEditor: true }
        })
    }

    public updateView() {
        // 获取 editor
        const editor = this.getEditorInstance()
        const content = editor!.children

        // console.log('updateView', content)

        // 生成 vnode
        const textAreaVnode = this.genTextAreaVnode()
        textAreaVnode.children = content.map(node => node2Vnode(node))

        // patchView
        if (this.isFirstPatchView) {
            this.patchFn(this.$textArea[0], textAreaVnode)
            this.isFirstPatchView = false
        } else {
            this.patchFn(this.curVnode, textAreaVnode)
        }

        // 存储最新的 vnode
        this.curVnode = textAreaVnode
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
