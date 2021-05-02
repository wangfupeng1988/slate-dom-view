/**
 * @description render element node
 * @author wangfupeng
 */

import { Node, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { node2Vnode } from './index'
import { IDomEditor, DomEditor } from '../editor/dom-editor'
import { KEY_TO_ELEMENT, NODE_TO_ELEMENT, ELEMENT_TO_NODE } from '../utils/weak-maps'

function defaultRender(elemNode: SlateElement, editor: IDomEditor): VNode {
    const Tag = editor.isInline(elemNode) ? 'span' : 'div'

    const children = elemNode.children || []
    const vnode = <Tag>
        {children.map((child: Node, index: number) => {
            return node2Vnode(child, index, elemNode, editor)
        })}
    </Tag>

    return vnode
}

export function renderElement(elemNode: SlateElement, editor: IDomEditor): VNode {
    // @ts-ignore
    const { type } = elemNode
    // 根据 type 生成 vnode 的函数
    const genVnodeFn = defaultRender
    // TODO 各个 type 的 render 函数 ？？？

    // 创建 vnode
    const vnode = genVnodeFn(elemNode, editor)

    // 添加 element 属性
    const key = DomEditor.findKey(editor, elemNode)
    const id = `w-e-element-${key.id}`
    const attr = {
        id,
        'data-slate-node': 'element'
    }
    if (vnode.data == null) vnode.data = {}
    Object.assign(vnode.data, attr)

    // 更新 element 相关的 weakMap
    setTimeout(() => {
        // 异步，否则拿不到 DOM 节点
        const dom = document.getElementById(id) as HTMLElement
        KEY_TO_ELEMENT.set(key, dom)
        NODE_TO_ELEMENT.set(elemNode, dom)
        ELEMENT_TO_NODE.set(dom, elemNode)
    })

    // TODO 渲染 element void 还没有做？？？

    return vnode
}
