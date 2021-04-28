/**
 * @description formats entry
 * @author wangfupeng
 */

import { Node as SlateNode } from 'slate'
import { VNode } from 'snabbdom'
import { normalizeVnodeData } from '../utils/vdom'

// 引入各个 format
import paragraphFormatConf from './basic-formats/paragraph'
import textFormatConf from './basic-formats/text'

// 用于存储所有 formats
interface IFormats {
    [key: string]: (node: SlateNode) => VNode
}
const FORMATS: IFormats = {}

// 注册 formats
FORMATS[paragraphFormatConf.type] = paragraphFormatConf.genVnode
FORMATS[textFormatConf.type] = textFormatConf.genVnode


/**
 * 根据 slate node 生成 snabbdom vnode
 * @param node node
 */
export function node2Vnode(node: SlateNode): VNode {
    let vnode: VNode

    // @ts-ignore
    let genVNode = node.type ? FORMATS[node.type]
                                : FORMATS['text']

    // 生成当前节点的 vnode
    vnode = genVNode(node)

    // 整理 vnode.data
    normalizeVnodeData(vnode)

    return vnode
}
