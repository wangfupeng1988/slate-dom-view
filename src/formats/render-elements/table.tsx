/**
 * @description render table
 * @author wangfupeng
 */

import { Node, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '../../editor/dom-editor'
import { node2Vnode } from '../index'

const renderTdConf = {
    type: 'table-cell',
    renderFn(elemNode: SlateElement, editor: IDomEditor): VNode {
        // @ts-ignore
        const { children = [], colSpan = 1, rowSpan = 1 } = elemNode
        const vnode = <td colSpan={colSpan} rowSpan={rowSpan}>
            {children.map((child: Node, index: number) => {
                return node2Vnode(child, index, elemNode, editor)
            })}
        </td>
        return vnode
    }
}

const renderTrConf = {
    type: 'table-row',
    renderFn(elemNode: SlateElement, editor: IDomEditor): VNode {
        const children = elemNode.children || []
        const vnode = <tr>
            {children.map((child: Node, index: number) => {
                return node2Vnode(child, index, elemNode, editor)
            })}
        </tr>
        return vnode
    }
}

const renderTableConf = {
    type: 'table',
    renderFn(elemNode: SlateElement, editor: IDomEditor): VNode {
        const children = elemNode.children || []
        const vnode = <table>
            <tbody>
                {children.map((child: Node, index: number) => {
                    return node2Vnode(child, index, elemNode, editor)
                })}
            </tbody>
        </table>
        return vnode
    }
}

export {
    renderTdConf,
    renderTrConf,
    renderTableConf
}
