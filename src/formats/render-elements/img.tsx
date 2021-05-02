/**
 * @description render image
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '../../editor/dom-editor'

function renderImage(elemNode: SlateElement, editor: IDomEditor): VNode {
    // @ts-ignore
    const { url } = elemNode
    const vnode = <img src={url}/>
    return vnode
}

export default {
    type: 'image', // 和 elemNode.type 一致
    renderFn: renderImage
}
