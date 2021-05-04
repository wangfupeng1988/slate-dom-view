/**
 * @description render list
 * @author wangfupeng
 */

import { Node, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '../../editor/dom-editor'
import { node2Vnode } from '../index'

function genTag(type: string): string {
    if (type === 'bulleted-list') return 'ul'
    if (type === 'numbered-list') return 'ol'
    if (type === 'list-item') return 'li'
    throw new Error(`list type '${type}' is invalid`)
}

function genRenderFn(type: string) {
    function renderFn(elemNode: SlateElement, editor: IDomEditor): VNode {
        const Tag = genTag(type)
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

const renderBulletedListConf = {
    type: 'bulleted-list', // 和 elemNode.type 一致
    renderFn: genRenderFn('bulleted-list')
}

const renderNumberedListConf = {
    type: 'numbered-list', // 和 elemNode.type 一致
    renderFn: genRenderFn('numbered-list')
}
const renderListItemConf = {
    type: 'list-item', // 和 elemNode.type 一致
    renderFn: genRenderFn('list-item')
}

export {
    renderBulletedListConf,
    renderNumberedListConf,
    renderListItemConf
}
