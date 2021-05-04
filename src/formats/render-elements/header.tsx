/**
 * @description render header
 * @author wangfupeng
 */

import { Node, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '../../editor/dom-editor'
import { node2Vnode } from '../index'

function genRenderFn(header: number) {
    function renderFn(elemNode: SlateElement, editor: IDomEditor): VNode {
        const Tag = `h${header}`
        const children = elemNode.children || []
        const vnode = <Tag>
            {children.map((child: Node, index: number) => {
                return node2Vnode(child, index, elemNode, editor)
            })}
        </Tag>
    
        return vnode
    }

    return renderFn
}

const renderHeader1Conf = {
    type: 'header1', // 和 elemNode.type 一致
    renderFn: genRenderFn(1)
}
const renderHeader2Conf = {
    type: 'header2',
    renderFn: genRenderFn(2)
}
const renderHeader3Conf = {
    type: 'header3',
    renderFn: genRenderFn(3)
}

export {
    renderHeader1Conf,
    renderHeader2Conf,
    renderHeader3Conf
}
