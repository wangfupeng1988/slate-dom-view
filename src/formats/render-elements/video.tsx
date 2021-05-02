
/**
 * @description render video
 * @author wangfupeng
 */

import { Element as SlateElement } from 'slate'
import { jsx, VNode } from 'snabbdom'
import { IDomEditor } from '../../editor/dom-editor'

function renderVideo(elemNode: SlateElement, editor: IDomEditor): VNode {
    // @ts-ignore
    const { url } = elemNode
    const vnode = <div contentEditable={false}>
        <video controls width="250">
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
