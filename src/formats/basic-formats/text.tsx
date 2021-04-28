/**
 * @description text format
 * @author wangfupeng
 */

import { jsx, VNode } from 'snabbdom'
import { Node as SlateNode } from 'slate'

export default {
    type: 'text',
    genVnode(node: SlateNode): VNode {
        // @ts-ignore
        if (node.type || !node.text) throw new Error(`Current node is not Text`)

        // @ts-ignore
        const { text = '', bold = null, underline = null, italic = null } = node
        const style = {
            fontWeight: bold ? 'bold' : 'normal',
            textDecoration: underline ? 'underline': 'normal',
            fontStyle: italic ? 'italic' : 'normal'
        }

        const vnode = <span style={style}>
            {text}
        </span>

        return vnode
    }
}
 