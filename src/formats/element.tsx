/**
 * @description render element node
 * @author wangfupeng
 */

import { Editor, Node, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { node2Vnode } from './index'
import { IDomEditor, DomEditor } from '../editor/dom-editor'
import { KEY_TO_ELEMENT, NODE_TO_ELEMENT, ELEMENT_TO_NODE, NODE_TO_INDEX, NODE_TO_PARENT } from '../utils/weak-maps'
import { getRenderFn } from './render-elements/index'
import addTextStyle from './render-elements/addTextStyle'
import { promiseResolveThen } from '../utils/util'

interface IAttrs {
    id: string
    key: string | number
    'data-slate-node': 'element'
    'data-slate-inline'?: boolean
    'data-slate-void'?: boolean
    contentEditable?: Boolean
}

export function renderElement(elemNode: SlateElement, editor: IDomEditor): VNode {
    const key = DomEditor.findKey(editor, elemNode)
    const readOnly = DomEditor.isReadOnly(editor)
    const isInline = editor.isInline(elemNode)
    const domId = `w-e-element-${key.id}`
    const attrs: IAttrs = {
        id: domId,
        key: key.id,
        'data-slate-node': 'element',
        'data-slate-inline': isInline
    }

    // 根据 type 生成 vnode 的函数
    // @ts-ignore
    const { type } = elemNode
    let genVnodeFn = getRenderFn(type)

    // 创建 vnode
    let vnode = genVnodeFn(elemNode, editor)

    // void node 要特殊处理
    if (Editor.isVoid(editor, elemNode)) {
        attrs['data-slate-void'] = true

        // 如果这里设置 contentEditable = false ，那图片就无法删除了 ？？？
        // if (!readOnly && isInline) {
        //     attrs.contentEditable = false
        // }

        const Tag = isInline ? 'span' : 'div'
        const [[text]] = Node.texts(elemNode)

        const textVnode = node2Vnode(text, 0, elemNode, editor)
        const textWrapperVnode = <Tag
            data-slate-spacer
            style={{
                height: '0',
                color: 'transparent',
                outline: 'none',
                position: 'absolute',
            }}
        >
            {textVnode}
        </Tag>

        // 重写 vnode
        vnode = <Tag>
            {vnode}
            {textWrapperVnode}
        </Tag>

        // 记录 text 相关 weakMap
        NODE_TO_INDEX.set(text, 0)
        NODE_TO_PARENT.set(text, elemNode)
    }

    // 添加 element 属性
    if (vnode.data == null) vnode.data = {}
    Object.assign(vnode.data, attrs)

    // 添加文本相关的样式，如 text-align
    if (!Editor.isVoid(editor, elemNode) && !editor.isInline(elemNode)) {
        // 非 void + 非 inline
        addTextStyle(elemNode, vnode)
    }

    // 更新 element 相关的 weakMap
    promiseResolveThen(() => {
        // 异步，否则拿不到 DOM 节点
        const dom = document.getElementById(domId) as HTMLElement
        KEY_TO_ELEMENT.set(key, dom)
        NODE_TO_ELEMENT.set(elemNode, dom)
        ELEMENT_TO_NODE.set(dom, elemNode)
    })

    return vnode
}
