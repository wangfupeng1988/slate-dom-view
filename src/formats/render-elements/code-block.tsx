/**
 * @description code block render
 * @author wangfupeng
 */

import { Node, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '../../editor/dom-editor'
import { node2Vnode } from '../index'

const renderPreConf = {
    type: 'pre',
    renderFn(elemNode: SlateElement, editor: IDomEditor): VNode {
        const children = elemNode.children || []
        const vnode = <pre>
            {children.map((child: Node, index: number) => {
                return node2Vnode(child, index, elemNode, editor)
            })}
        </pre>
    
        return vnode
    }
}

const renderCodeConf = {
    type: 'code',
    renderFn(elemNode: SlateElement, editor: IDomEditor): VNode {
        // @ts-ignore
        const { language, children = [] } = elemNode
        const vnode = <code className={`language-${language}`}>
            {children.map((child: Node, index: number) => {
                return node2Vnode(child, index, elemNode, editor)
            })}
        </code>
    
        return vnode
    }
}

export {
    renderPreConf,
    renderCodeConf
}
