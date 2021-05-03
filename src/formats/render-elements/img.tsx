/**
 * @description render image
 * @author wangfupeng
 */

import { Editor, Element as SlateElement, Node as SlateNode, Path } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '../../editor/dom-editor'

// 判断图片是否被选中
// 【注意】判断是否被选中，应该统一抽离一个方法来处理？？？
function isSelected(elemNode: SlateElement, editor: IDomEditor): boolean {
    const { selection } = editor
    if (selection == null) return false

    const { anchor, focus } = selection
    const isSamePath = Path.equals(anchor.path, focus.path)
    if (!isSamePath) return false

    const voidNodeEntry = Editor.void(editor, { at: anchor.path })
    if (voidNodeEntry == null) return false
    const [voidNode] = voidNodeEntry

    if (elemNode === voidNode) return true

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
