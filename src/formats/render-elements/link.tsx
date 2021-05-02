/**
 * @description render link
 * @author wangfupeng
 */

import { Node, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '../../editor/dom-editor'
import { node2Vnode } from '../index'

function renderLink(elemNode: SlateElement, editor: IDomEditor): VNode {
    // @ts-ignore
    const { children = [], url } = elemNode
    const vnode = <a href={url}>
        {children.map((child: Node, index: number) => {
            return node2Vnode(child, index, elemNode, editor)
        })}
    </a>

    return vnode
}

export default {
    type: 'link', // 和 elemNode.type 一致
    renderFn: renderLink
}
