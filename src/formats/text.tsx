/**
 * @description render text node
 * @author wangfupeng
 */

import { Editor, Path, Node, Text as SlateText, Ancestor } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor, DomEditor } from '../editor/dom-editor'
import { KEY_TO_ELEMENT, NODE_TO_ELEMENT, ELEMENT_TO_NODE } from '../utils/weak-maps'

/**
 * 给字符串增加样式
 * @param node slate text node
 * @param vnode str vnode
 */
function addStyle(node: SlateText, vnode: VNode): VNode {
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

function str(text: string, isTrailing = false): VNode {
    return <span data-slate-string>
        {text}
        {isTrailing ? '\n' : null}
    </span>
}

function zeroWidthStr(length = 0, isLineBreak = false): VNode {
    return <span
        data-slate-zero-width={isLineBreak ? 'n' : 'z'}
        data-slate-length={length}
    >
        {'\uFEFF'}
        {isLineBreak ? <br /> : null}
    </span>
}

function genStrVnode(textNode: SlateText, parent: Ancestor, editor: IDomEditor): VNode {
    const { text } = textNode
    const path = DomEditor.findPath(editor, textNode)
    const parentPath = Path.parent(path)

    // COMPAT: Render text inside void nodes with a zero-width space.
    // So the node can contain selection but the text is not visible.
    if (editor.isVoid(parent)) {
        return zeroWidthStr(Node.string(parent).length)
    }

    // COMPAT: If this is the last text node in an empty block, render a zero-
    // width space that will convert into a line break when copying and pasting
    // to support expected plain text.
    if (
        text === '' &&
        parent.children[parent.children.length - 1] === textNode &&
        !editor.isInline(parent) &&
        Editor.string(editor, parentPath) === ''
    ) {
        return zeroWidthStr(0, true)
    }

    // COMPAT: If the text is empty, it's because it's on the edge of an inline
    // node, so we render a zero-width space so that the selection can be
    // inserted next to it still.
    if (text === '') {
        return zeroWidthStr()
    }

    // COMPAT: Browsers will collapse trailing new lines at the end of blocks,
    // so we need to add an extra trailing new lines to prevent that.
    if (text.slice(-1) === '\n') {
        return str(text, true)
    }

    return str(text)
}

function renderText(textNode: SlateText, parent: Ancestor, editor: IDomEditor): VNode {
    if (textNode.text == null) throw new Error(`Current node is not slate Text ${JSON.stringify(textNode)}`)
    const key = DomEditor.findKey(editor, textNode)

    // 文字和样式
    let strVnode = genStrVnode(textNode, parent, editor)
    strVnode = addStyle(textNode, strVnode)

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
