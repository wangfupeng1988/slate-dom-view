/**
 * @description formats entry
 * @author wangfupeng
 */

import { Element, Text, Node, Ancestor } from 'slate'
import { VNode } from 'snabbdom'
import { IDomEditor } from '../editor/dom-editor'
import { normalizeVnodeData } from '../utils/vdom'
import { renderElement } from './element'
import renderText from './text'
import { NODE_TO_INDEX, NODE_TO_PARENT } from '../utils/weak-maps'

/**
 * 根据 slate node 生成 snabbdom vnode
 * @param node node
 * @param index node index in parent.children
 * @param parent parent node
 * @param editor editor
 */
export function node2Vnode(node: Node, index: number, parent: Ancestor, editor: IDomEditor): VNode {
    // @ts-ignore
    const { type } = node

    let vnode: VNode
    let isText = false
    if (Element.isElement(node)) {
        // element
        vnode = renderElement(node as Element, editor)
    } else {
        // text
        isText = true
        vnode = renderText(node as Text, editor)
    }

    // 存储信息
    NODE_TO_INDEX.set(node, index)
    NODE_TO_PARENT.set(node, parent)

    // 设置 key 以提效 diff
    if (vnode.data == null) vnode.data = {}
    vnode.data.key = index

    // 统一整理 vnode.data 以符合 snabbdom 的规则 （text 需要遍历子节点）
    normalizeVnodeData(vnode, isText)

    return vnode
}
