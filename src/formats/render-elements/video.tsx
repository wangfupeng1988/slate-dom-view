/**
 * @description render video
 * @author wangfupeng
 */

import { Editor, Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '../../editor/dom-editor'

function isSelected(elemNode: SlateElement, editor: IDomEditor): boolean {
    const [match] = Editor.nodes(editor, {
        // @ts-ignore
        match: n => n.type === 'video'
    })
    if (match == null) return false

    const [ n ] = match
    if (n === elemNode) return true

    return false
}

function renderVideo(elemNode: SlateElement, editor: IDomEditor): VNode {
    // @ts-ignore
    const { url } = elemNode

    // 更新 url 时，view 不会重新渲染？？？

    const selected = isSelected(elemNode, editor)
    const style = {
        textAlign: 'center',
        boxShadow: selected ? '0 0 0 3px #B4D5FF' : 'none'
    }

    const vnode = <div
        contentEditable={false}
        style={style}
    >
        <video controls width="300">
            <source src={url} type="video/mp4"/>
            {`Sorry, your browser doesn't support embedded videos.`}
        </video>
    </div>

    return vnode
}

export default {
    type: 'video', // 和 elemNode.type 一致
    renderFn: renderVideo
}
