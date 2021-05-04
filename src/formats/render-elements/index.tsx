/**
 * @description 自定义 render entry
 * @author wangfupeng
 */

import { Node, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '../../editor/dom-editor'
import { node2Vnode } from '../index'

// 引入基础的 render element conf
import renderParagraphConf from './p'
import { renderHeader1Conf, renderHeader2Conf, renderHeader3Conf } from './header'
import renderImageConf from './img'
import renderLinkConf from './link'
import renderVideoConf from './video'

type RenderFnType = (elemNode: SlateElement, editor: IDomEditor) => VNode

// 注册 render element 配置
const BASIC_RENDER_ELEM_CONF: {
    [key: string]: RenderFnType
} = {}
BASIC_RENDER_ELEM_CONF[renderParagraphConf.type] = renderParagraphConf.renderFn
BASIC_RENDER_ELEM_CONF[renderHeader1Conf.type] = renderHeader1Conf.renderFn
BASIC_RENDER_ELEM_CONF[renderHeader2Conf.type] = renderHeader2Conf.renderFn
BASIC_RENDER_ELEM_CONF[renderHeader3Conf.type] = renderHeader3Conf.renderFn
BASIC_RENDER_ELEM_CONF[renderImageConf.type] = renderImageConf.renderFn
BASIC_RENDER_ELEM_CONF[renderLinkConf.type] = renderLinkConf.renderFn
BASIC_RENDER_ELEM_CONF[renderVideoConf.type] = renderVideoConf.renderFn

// 默认的渲染函数，匹配不到任何 type 时，就用默认的
function defaultRender(elemNode: SlateElement, editor: IDomEditor): VNode {
    const Tag = editor.isInline(elemNode) ? 'span' : 'div'

    const children = elemNode.children || []
    const vnode = <Tag>
        {children.map((child: Node, index: number) => {
            return node2Vnode(child, index, elemNode, editor)
        })}
    </Tag>

    return vnode
}

/**
 * 根据 elemNode.type 获取 renderElement 函数
 * @param type elemNode.type
 */
export function getRenderFn(type: string): RenderFnType {
    const fn = BASIC_RENDER_ELEM_CONF[type]
    return fn || defaultRender
}
