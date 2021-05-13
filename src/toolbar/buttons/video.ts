/**
 * @description video button
 * @author wangfupeng
 */

import { Editor, Element, Node, Transforms } from 'slate'
import $, { Dom7Array } from '../../utils/dom'
import { IToolButton, getEditorInstanceByButton } from './index'

// 【注意】e.normalizeNode 增加两个 video 的规则（和 table 类似）
// 1. video 不能是最后一个节点，否则就在下面增加一个空行
// 2. video 后面不能紧跟着 video ，中间用空行隔开

/**
 * 检查 node 是否是 video
 * @param n slate node
 */
function checkVideo(n: Node): boolean {
    if (Editor.isEditor(n)) return false
    if (Element.isElement(n)) {
        // @ts-ignore
        return n.type === 'video'
    }
    return false
}

class Video implements IToolButton {
    key = 'video'
    $elem: Dom7Array
    private selectedNode: Node | null = null

    constructor() {
        const $elem = $('<button>Video</button>')
        this.$elem = $elem

        $elem.on('click', this.onClick.bind(this))
    }

    private onClick() {
        if (this.selectedNode == null) {
            this.insertVideo()
        } else {
            this.changeVideoUrl()
        }
    }

    private insertVideo() {
        const url = prompt('', '')
        if (!url) return

        const editor = getEditorInstanceByButton(this)

        // 如果当前选区是一个空行，无内容，则删掉该空行
        const [ pEntry ] = Editor.nodes(editor, {
            // @ts-ignore
            match: n => n.type === 'paragraph',
            universal: true
        })
        if (pEntry) {
            const [ p ] = pEntry
            if (Node.string(p) === '') {
                Transforms.removeNodes(editor, { mode: 'highest' })
            }
        }

        const newNode = {
            type: 'video',
            url,
            children: [{ text: '' }]
        }
        Transforms.insertNodes(editor, newNode, { mode: 'highest' })
    }

    private changeVideoUrl() {
        const { selectedNode } = this
        if (selectedNode == null) return

        // @ts-ignore
        const { url } = selectedNode
        const newUrl = prompt('', url)
        if (!newUrl) return

        const editor = getEditorInstanceByButton(this)
        Transforms.setNodes(
            editor,
            {
                // @ts-ignore
                url: newUrl
            },
            { mode: 'highest' }
        )
    }

    toggleActive() {
        const editor = getEditorInstanceByButton(this)

        const [ nodeEntry ] = Editor.nodes(editor, {
            match: checkVideo
        })

        if (nodeEntry) {
            this.selectedNode = nodeEntry[0]
        } else {
            this.selectedNode = null
        }

        // 修改 btn 样式
        const $elem = this.$elem
        const className = 'btn-active'
        if (nodeEntry) {
            $elem.addClass(className)
        } else {
            $elem.removeClass(className)
        }
    }
}

export default Video