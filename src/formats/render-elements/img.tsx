/**
 * @description render image
 * @author wangfupeng
 */

import { Editor, Element as SlateElement, Node as SlateNode, Path } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '../../editor/dom-editor'

/**
 * 检查 node 是否是 image
 * @param n slate node
 */
 function checkImage(n: SlateNode): boolean {
    if (Editor.isEditor(n)) return false
    if (SlateElement.isElement(n)) {
        // @ts-ignore
        return n.type === 'image'
    }
    return false
}

// 判断图片是否被选中
// 【注意】判断是否被选中，应该统一抽离一个方法来处理？？？
function isSelected(elemNode: SlateElement, editor: IDomEditor): boolean {
    const [match] = Editor.nodes(editor, {
        match: checkImage
    })
    if (match == null) return false

    const [ n ] = match
    if (n === elemNode) return true

    return false
}

function renderImage(elemNode: SlateElement, editor: IDomEditor): VNode {
    const selected = isSelected(elemNode, editor)
    const style = { boxShadow: selected ? '0 0 0 3px #B4D5FF' : 'none' }

    // @ts-ignore
    const { url } = elemNode
    const vnode = <img style={style} src={url} />
    return vnode
}

export default {
    type: 'image', // 和 elemNode.type 一致
    renderFn: renderImage
}
