/**
 * @description bold button
 * @author wangfupeng
 */

import { Editor } from 'slate'
import $, { Dom7Array } from '../../utils/dom'
import { IToolButton, getEditorInstanceByButton } from './index'

class Bold implements IToolButton {
    key = 'bold'
    $elem: Dom7Array
    private isBold: boolean = false

    constructor() {
        const $elem = $('<button>B</button>')

        $elem.on('click', this.onClick.bind(this))

        this.$elem = $elem
    }

    private onClick() {
        const editor = getEditorInstanceByButton(this)
        const isBold = this.isBold

        // 切换 bold 状态
        if (isBold) {
            Editor.removeMark(editor, 'bold')
        } else {
            Editor.addMark(editor, 'bold', true)
        }
    }

    toggleActive() {
        const editor = getEditorInstanceByButton(this)

        const [ match ] = Editor.nodes(editor, {
            // @ts-ignore
            match: n => n.bold === true,
            universal: true
        })
        const isBold = !!match

        // 修改 btn 样式
        const $elem = this.$elem
        const className = 'btn-active'
        if (isBold) {
            $elem.addClass(className)
        } else {
            $elem.removeClass(className)
        }

        // 记录
        this.isBold = isBold
    }
}

export default Bold