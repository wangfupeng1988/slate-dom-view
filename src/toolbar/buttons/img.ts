/**
 * @description image button
 * @author wangfupeng
 */

import { Editor, Element, Node, Transforms } from 'slate'
import $, { Dom7Array } from '../../utils/dom'
import { IToolButton, getEditorInstanceByButton } from './index'

/**
 * 检查 node 是否是 image
 * @param n slate node
 */
function checkImage(n: Node): boolean {
    if (Editor.isEditor(n)) return false
    if (Element.isElement(n)) {
        // @ts-ignore
        return n.type === 'image'
    }
    return false
}

class Image implements IToolButton {
    key = 'image'
    $elem: Dom7Array
    private isImage: boolean = false

    constructor() {
        const $elem = $('<button>Img</button>')
        this.$elem = $elem

        $elem.on('click', this.onClick.bind(this))
    }

    private onClick() {
        const editor = getEditorInstanceByButton(this)
        const isImage = this.isImage

        if (isImage) return // 当前选中图片，不再处理

        const url = prompt('请输入图片网址')
        const { selection } = editor
        if (selection == null || !url) return

        const text = { text: '' }
        const image = { type: 'image', url, children: [text] } // void node 需要一个空 text 作为 children
        Transforms.insertNodes(editor, image) // 插入图片
    }

    toggleActive() {
        const editor = getEditorInstanceByButton(this)

        const [match] = Editor.nodes(editor, {
            match: checkImage
        })
        const isImage = !!match

        // 修改 btn 样式
        const $elem = this.$elem
        const className = 'btn-active'
        if (isImage) {
            $elem.addClass(className)
        } else {
            $elem.removeClass(className)
        }

        // 记录
        this.isImage = isImage
    }
}

export default Image
