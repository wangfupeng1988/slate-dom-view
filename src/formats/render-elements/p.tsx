/**
 * @description render paragraph
 * @author wangfupeng
 */

import { Node, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '../../editor/dom-editor'
import { node2Vnode } from '../index'

function renderParagraph(elemNode: SlateElement, editor: IDomEditor): VNode {
    const children = elemNode.children || []
    const vnode = <p>
        {children.map((child: Node, index: number) => {
            return node2Vnode(child, index, elemNode, editor)
        })}
    </p>

    return vnode
}

export default {
    type: 'paragraph', // 和 elemNode.type 一致
    renderFn: renderParagraph
}
