/**
 * @description 添加文本相关的样式
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { addVnodeStyle } from '../../utils/vdom'

/**
 * 给字符串增加样式
 * @param node slate elem node
 * @param vnode elem Vnode
 */
function addTextStyle(node: SlateElement, vnode: VNode): VNode {
    // @ts-ignore
    const { textAlign } = node
    let styleVnode: VNode = vnode

    // 【注意】各个样式和属性的顺序

    if (textAlign) {
        addVnodeStyle(styleVnode, { textAlign })
    }

    return styleVnode
}

export default addTextStyle