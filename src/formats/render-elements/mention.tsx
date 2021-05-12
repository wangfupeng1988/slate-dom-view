/**
 * @description render mention
 * @author wangfupeng
 */

import { Editor, Node, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '../../editor/dom-editor'

function isSelected(elemNode: SlateElement, editor: IDomEditor): boolean {
    const [match] = Editor.nodes(editor, {
        // @ts-ignore
        match: n => n.type === 'mention'
    })
    if (match == null) return false

    const [ n ] = match
    if (n === elemNode) return true

    return false
}

function renderMention(elemNode: SlateElement, editor: IDomEditor): VNode {
    // @ts-ignore
    const { content = '' } = elemNode
    const vnode = <span
        contentEditable={false}
        style={{
            padding: '3px 3px 2px',
            margin: '0 3px',
            verticalAlign: 'baseline',
            display: 'inline-block',
            borderRadius: '4px',
            backgroundColor: '#eee',
            fontSize: '0.9em',
            boxShadow: isSelected(elemNode, editor) ? '0 0 0 2px #B4D5FF' : 'none',
        }}
    >
        @{content}

        {/* 这里不要再渲染 children ，element.tsx 已经做了*/}
    </span>

    return vnode
}

export default {
    type: 'mention', // 和 elemNode.type 一致
    renderFn: renderMention
}

