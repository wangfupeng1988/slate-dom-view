/**
 * @description link button
 * @author wangfupeng
 */

import { Editor, Element, Node, Transforms, Range } from 'slate'
import $, { Dom7Array } from '../../utils/dom'
import { IToolButton, getEditorInstanceByButton } from './index'

/**
 * 检查 node 是否是 link
 * @param n slate node
 */
function checkLink(n: Node): boolean {
    if (Editor.isEditor(n)) return false
    if (Element.isElement(n)) {
        // @ts-ignore
        return n.type === 'link'
    }
    return false
}

class Link implements IToolButton {
    key = 'link'
    $elem: Dom7Array
    private isLink: boolean = false

    constructor() {
        const $elem = $('<button>Link</button>')
        this.$elem = $elem

        $elem.on('click', this.onClick.bind(this))
    }

    private onClick() {
        const editor = getEditorInstanceByButton(this)
        const isLink = this.isLink

        if (isLink) {
            // 当前处于 link ，则取消
            Transforms.unwrapNodes(editor, {
                match: checkLink
            })
            return
        }

        // 当前不是 link ，则插入link
        const url = prompt('请输入网址')
        const { selection } = editor
        if (selection == null || !url) return
        const isCollapsed = Range.isCollapsed(selection)

        const linkNode = {
            type: 'link',
            url,
            children: isCollapsed ? [{ text: url }] : [],
        }

        if (isCollapsed) {
            // @ts-ignore
            Transforms.insertNodes(editor, linkNode)
        } else {
            // @ts-ignore
            Transforms.wrapNodes(editor, linkNode, { split: true })
            Transforms.collapse(editor, { edge: 'end' })
        }
    }

    toggleActive() {
        const editor = getEditorInstanceByButton(this)

        const [match] = Editor.nodes(editor, {
            match: checkLink
        })
        const isLink = !!match

        // 修改 btn 样式
        const $elem = this.$elem
        const className = 'btn-active'
        if (isLink) {
            $elem.addClass(className)
        } else {
            $elem.removeClass(className)
        }

        // 记录
        this.isLink = isLink
    }
}

export default Link
