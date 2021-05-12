/**
 * @description render formula
 * @author wangfupeng
 */

import katex from 'katex'
import 'katex/dist/katex.min.css'

import { Editor, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor, DomEditor } from '../../editor/dom-editor'

function isSelected(elemNode: SlateElement, editor: IDomEditor): boolean {
    const [match] = Editor.nodes(editor, {
        // @ts-ignore
        match: n => n.type === 'formula'
    })
    if (match == null) return false

    const [ n ] = match
    if (n === elemNode) return true

    return false
}

function renderFormula(elemNode: SlateElement, editor: IDomEditor): VNode {
    // @ts-ignore
    const { value = '' } = elemNode
    const key = DomEditor.findKey(editor, elemNode)
    const domId = `w-e-formula-${key.id}`

    const vnode = <span
        id={domId}
        contentEditable={false}
        style={{
            padding: '3px 3px 2px',
            margin: '0 3px',
            verticalAlign: 'baseline',
            display: 'inline-block',
            borderRadius: '4px',
            fontSize: '0.9em',
            boxShadow: isSelected(elemNode, editor) ? '0 0 0 2px #B4D5FF' : 'none',
        }}
    ></span>

    setTimeout(() => {
        // 【注意】虽然会频繁渲染 DOM ，但公式较少的情况下，问题不大。而且是异步的，不会造成卡顿的

        const el = document.getElementById(domId)
        if (el == null) return
        el.innerHTML = ''
        katex.render(value, el, {
            throwOnError: false
        })
    })

    return vnode
}

export default {
    type: 'formula', // 和 elemNode.type 一致
    renderFn: renderFormula
}