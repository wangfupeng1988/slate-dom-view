/**
 * @description text-area class
 * @author wangfupeng
 */

import { h, VNode } from 'snabbdom'
import $, { Dom7Array } from '../utils/dom'
import { genRandomStr } from '../utils/util'
import { node2Vnode } from '../formats/index'
import { genPatchFn } from '../utils/vdom'
import { TEXTAREA_TO_EDITOR } from '../utils/weak-map'
import { IWeEditor } from '../editor/index'

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
        const $textArea = $(`<div id="${this.textAreaId}" contenteditable="true"></div>`)
        $textAreaContainer.append($textArea)
        this.$textAreaContainer = $textAreaContainer
        this.$textArea = $textArea

        // 初始化 vdom patch 函数 
        this.patchFn = genPatchFn()
    }

    private getEditorInstance(): IWeEditor | null {
        const editor = TEXTAREA_TO_EDITOR.get(this)
        return editor || null
    }

    private genTextAreaVnode(): VNode {
        return h(`div#${this.textAreaId}`, {
            props: { contenteditable: true }
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
}

export default TextArea
