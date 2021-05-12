/**
 * @description mention button
 * @author wangfupeng
 */

import { Editor, Element, Node, Transforms } from 'slate'
import $, { Dom7Array } from '../../utils/dom'
import { IToolButton, getEditorInstanceByButton } from './index'

/**
 * 检查 node 是否是 mention
 * @param n slate node
 */
function checkMention(n: Node): boolean {
    if (Editor.isEditor(n)) return false
    if (Element.isElement(n)) {
        // @ts-ignore
        return n.type === 'mention'
    }
    return false
}

class Mention implements IToolButton {
    key = 'mention'
    $elem: Dom7Array
    private isMention: boolean = false

    constructor() {
        const $elem = $('<button>@</button>')
        this.$elem = $elem

        $elem.on('click', this.onClick.bind(this))
    }

    private onClick() {
        const editor = getEditorInstanceByButton(this)
        const isImage = this.isMention

        if (isImage) return // 当前选中图片，不再处理

        const content = prompt('')
        const { selection } = editor
        if (selection == null || !content) return

        const mention = { type: 'mention', content, children: [{ text: '' }] } // void node 需要一个空 text 作为 children
        Transforms.insertNodes(editor, mention)
    }

    toggleActive() {
        const editor = getEditorInstanceByButton(this)

        const [match] = Editor.nodes(editor, {
            match: checkMention
        })
        const isMention = !!match

        // 修改 btn 样式
        const $elem = this.$elem
        const className = 'btn-active'
        if (isMention) {
            $elem.addClass(className)
        } else {
            $elem.removeClass(className)
        }

        // 记录
        this.isMention = isMention
    }
}

export default Mention
