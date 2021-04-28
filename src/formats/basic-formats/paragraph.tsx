/**
 * @description paragraph format
 * @author wangfupeng
 */

import { jsx, VNode } from 'snabbdom'
import { Node as SlateNode } from 'slate'
import { node2Vnode } from '../index'

const TYPE = 'paragraph'

export default {
    type: TYPE,
    genVnode(elem: SlateNode): VNode {
        // @ts-ignore
        if (elem.type !== TYPE) throw new Error(`Current node type ${elem.type} is not 'paragraph'`)

        // @ts-ignore
        const children = elem.children || []

        const vnode = <p>
            {children.map(node2Vnode)}
        </p>

        return vnode
    }
}
