/**
 * @description render text node
 * @author wangfupeng
 */

import { Text as SlateText, Ancestor } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor, DomEditor } from '../editor/dom-editor'
import { KEY_TO_ELEMENT, NODE_TO_ELEMENT, ELEMENT_TO_NODE } from '../utils/weak-maps'
import genTextVnode from './render-text/genVnode'
import addTextVnodeStyle from './render-text/addStyle'

function renderText(textNode: SlateText, parent: Ancestor, editor: IDomEditor): VNode {
    if (textNode.text == null) throw new Error(`Current node is not slate Text ${JSON.stringify(textNode)}`)
    const key = DomEditor.findKey(editor, textNode)

    // 文字和样式
    let strVnode = genTextVnode(textNode, parent, editor)
    strVnode = addTextVnodeStyle(textNode, strVnode)

    // 生成 text vnode
    const textId = `w-e-text-${key.id}`
    const vnode = <span data-slate-node="text" id={textId} key={key.id}>
        <span data-slate-leaf>
            {strVnode}
        </span>
    </span>

    // 更新 weak-map
    setTimeout(() => {
        // 异步，否则拿不到 DOM
        const dom = document.getElementById(textId) as HTMLElement
        KEY_TO_ELEMENT.set(key, dom)
        NODE_TO_ELEMENT.set(textNode, dom)
        ELEMENT_TO_NODE.set(dom, textNode)
    })

    return vnode
}

export default renderText
