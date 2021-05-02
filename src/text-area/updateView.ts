/**
 * @description patch textarea view
 * @author wangfupeng
 */

import { h, VNode } from 'snabbdom'
import { IDomEditor } from '../editor/dom-editor'
import TextArea from './TextArea'
import { genPatchFn, normalizeVnodeData } from '../utils/vdom'
import $, { Dom7Array } from '../utils/dom'
import { node2Vnode } from '../formats/index'
import {
    IS_FIRST_PATCH,
    TEXTAREA_TO_PATCH_FN,
    TEXTAREA_TO_VNODE,
    EDITOR_TO_ELEMENT,
    NODE_TO_ELEMENT,
    ELEMENT_TO_NODE,
    IS_FOCUSED
} from '../utils/weak-maps'

function genElemId(id: number) {
    return `w-e-textarea-${id}`
}

/**
 * 生成编辑区域节点的 vnode
 * @param elemId elemId
 */
function genRootVnode(elemId: string): VNode {
    return h(`div#${elemId}`, {
        props: { contenteditable: true },
        datasets: { slateEditor: true }
    })
}

/**
 * 生成编辑区域的 elem
 * @param elemId elemId
 */
function genRootElem(elemId: string): Dom7Array {
    return $(`<div id="${elemId}" contenteditable="true" data-slate-editor></div>`)
}

/**
 * 获取 editor.children 渲染 DOM
 * @param textarea textarea
 * @param editor editor
 */
function updateView(textarea: TextArea, editor: IDomEditor) {
    const $textAreaContainer = textarea.$textAreaContainer
    const elemId = genElemId(textarea.id)

    // 生成 newVnode
    const newVnode = genRootVnode(elemId)
    const content = editor.children || []
    newVnode.children = content.map((node, i) => {
        let vnode = node2Vnode(node, i, editor, editor)
        normalizeVnodeData(vnode) // 整理 vnode.data 以符合 snabbdom 的要求
        return vnode
    })

    let isFirstPatch = IS_FIRST_PATCH.get(textarea)
    if (isFirstPatch == null) isFirstPatch = true // 尚未赋值，也是第一次
    if (isFirstPatch) {
        // 第一次 patch ，先生成 elem
        const $textArea = genRootElem(elemId)
        $textAreaContainer.append($textArea)

        // 再生成 patch 函数，并执行
        const patchFn = genPatchFn()
        patchFn($textArea[0], newVnode)

        // 存储相关信息
        IS_FIRST_PATCH.set(textarea, false) // 不再是第一次 patch
        TEXTAREA_TO_PATCH_FN.set(textarea, patchFn) // 存储 patch 函数

    } else {
        // 不是第一次 patch
        const curVnode = TEXTAREA_TO_VNODE.get(textarea)
        const patchFn = TEXTAREA_TO_PATCH_FN.get(textarea)
        if (curVnode == null || patchFn == null) return

        patchFn(curVnode, newVnode)
    }

    // 存储相关信息
    const textareaElem = document.getElementById(elemId) as HTMLElement
    TEXTAREA_TO_VNODE.set(textarea, newVnode) // 存储 vnode
    EDITOR_TO_ELEMENT.set(editor, textareaElem!) // 存储 editor -> elem 对应关系
    NODE_TO_ELEMENT.set(editor, textareaElem!)
    ELEMENT_TO_NODE.set(textareaElem!, editor)

    // focus
    if (textarea.config.autoFocus) {
        isFirstPatch && textareaElem.focus()
        IS_FOCUSED.set(editor, true)
    } else {
        IS_FOCUSED.delete(editor)
    }
}

export default updateView
