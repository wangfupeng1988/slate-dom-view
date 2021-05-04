/**
 * @description text 样式
 * @author wangfupeng
 */

import { Text as SlateText } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { addVnodeStyle } from '../../utils/vdom'

/**
 * 给字符串增加样式
 * @param node slate text node
 * @param textVnode textVnode
 */
function addTextVnodeStyle(node: SlateText, textVnode: VNode): VNode {
    // @ts-ignore
    const { bold, italic, underline, code, color, bgColor } = node
    let styleVnode: VNode = textVnode

    // 【注意】各个样式和属性的顺序

    if (color) {
        addVnodeStyle(styleVnode, { color })
    }
    if (bgColor) {
        addVnodeStyle(styleVnode, { backgroundColor: bgColor })
    }
    if (bold) {
        styleVnode = <strong>{styleVnode}</strong>
    }
    if (code) {
        styleVnode = <code>styleVnode</code>
    }
    if (italic) {
        styleVnode = <em>styleVnode</em>
    }
    if (underline) {
        styleVnode = <u>styleVnode</u>
    }

    return styleVnode
}

export default addTextVnodeStyle
