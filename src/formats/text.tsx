/**
 * @description render text node
 * @author wangfupeng
 */

import { Text as SlateText } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor, DomEditor } from '../editor/dom-editor'
import { KEY_TO_ELEMENT, NODE_TO_ELEMENT, ELEMENT_TO_NODE } from '../utils/weak-maps'

/**
 * 给字符串增加样式
 * @param node slate text node
 * @param vnode str vnode
 */
function addTextStyle(node: SlateText, vnode: VNode): VNode {
    // @ts-ignore
    const { bold, italic, underline, code } = node
    let styleVnode: VNode = vnode

    // 【注意】各个样式和属性的顺序

    if (bold) {
        styleVnode = <strong>{vnode}</strong>
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

function renderText(textNode: SlateText, editor: IDomEditor): VNode {
    if (!textNode.text) throw new Error(`Current node is not slate Text`)
    const key = DomEditor.findKey(editor, textNode)

    // 文字和样式
    let strVnode = <span data-slate-string>
        {textNode.text}
    </span>
    strVnode = addTextStyle(textNode, strVnode)

    // 生成 text vnode
    const textId = `w-e-text-${key.id}`
    const vnode = <span data-slate-node="text" id={textId}>
        <span data-slate-leaf key={1}>
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
