/**
 * @description render element node
 * @author wangfupeng
 */

import { Editor, Node, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { node2Vnode } from './index'
import { IDomEditor, DomEditor } from '../editor/dom-editor'
import { KEY_TO_ELEMENT, NODE_TO_ELEMENT, ELEMENT_TO_NODE, NODE_TO_INDEX, NODE_TO_PARENT } from '../utils/weak-maps'

interface IAttrs {
    id: string
    key: string | number
    'data-slate-node': 'element'
    'data-slate-inline'?: boolean
    'data-slate-void'?: boolean
    contentEditable?: Boolean
}

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

function renderParagraph(elemNode: SlateElement, editor: IDomEditor): VNode {
    const children = elemNode.children || []
    const vnode = <p>
        {children.map((child: Node, index: number) => {
            return node2Vnode(child, index, elemNode, editor)
        })}
    </p>

    return vnode
}

function renderImage(elemNode: SlateElement, editor: IDomEditor): VNode {
    // @ts-ignore
    const { url } = elemNode
    const vnode = <img src={url}/>
    return vnode
}

function renderVideo(elemNode: SlateElement, editor: IDomEditor): VNode {
    // @ts-ignore
    const { url } = elemNode
    const vnode = <div contentEditable={false}>
        <video controls width="250">
            <source src={url} type="video/mp4"/>
            {`Sorry, your browser doesn't support embedded videos.`}
        </video>
    </div>

    return vnode
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

    // @ts-ignore
    const { type } = elemNode
    // 根据 type 生成 vnode 的函数
    let genVnodeFn = defaultRender // 默认
    if (type === 'paragraph') genVnodeFn = renderParagraph
    if (type === 'image') genVnodeFn = renderImage
    if (type === 'video') genVnodeFn = renderVideo
    // TODO 各个 type 的 render 函数 ？？？

    // 创建 vnode
    let vnode = genVnodeFn(elemNode, editor)

    // void node 要特殊处理
    if (Editor.isVoid(editor, elemNode)) {
        attrs['data-slate-void'] = true
        if (!readOnly && isInline) {
            attrs.contentEditable = false
        }

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

    // 更新 element 相关的 weakMap
    setTimeout(() => {
        // 异步，否则拿不到 DOM 节点
        const dom = document.getElementById(domId) as HTMLElement
        KEY_TO_ELEMENT.set(key, dom)
        NODE_TO_ELEMENT.set(elemNode, dom)
        ELEMENT_TO_NODE.set(dom, elemNode)
    })

    // TODO 渲染 element void 还没有做？？？

    return vnode
}
