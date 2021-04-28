/**
 * @description text-area class
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { h, VNode } from 'snabbdom'
import emitter from '../we/emitter'
import $, { Dom7Array } from '../utils/dom'
import { genRandomStr } from '../utils/util'
import { node2Vnode } from '../formats/index'
import { genPatchFn } from '../utils/vdom'

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

        // 监听 editor change
        emitter.on('editor:change', editor => {
            this.updateView(editor.children)
        })

        this.patchFn = genPatchFn()
    }

    private genTextAreaVnode(): VNode {
        return h(`div#${this.textAreaId}`, {
            props: { contenteditable: true }
        })
    }

    private updateView(content: SlateElement[]) {
        console.log('updateView', content)

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
