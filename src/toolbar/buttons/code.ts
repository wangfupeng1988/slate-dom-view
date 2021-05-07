/**
 * @description code button
 * @author wangfupeng
 */

import { Editor } from 'slate'
import $, { Dom7Array } from '../../utils/dom'
import { IToolButton, getEditorInstanceByButton } from './index'

class Code implements IToolButton {
    key = 'code'
    $elem: Dom7Array
    private isCode: boolean = false

    constructor() {
        const $elem = $('<button>Code</button>')
        this.$elem = $elem

        $elem.on('click', this.onClick.bind(this))
    }

    private onClick() {
        const editor = getEditorInstanceByButton(this)
        const isCode = this.isCode

        // 切换 code 状态
        if (isCode) {
            Editor.removeMark(editor, 'code')
        } else {
            Editor.addMark(editor, 'code', true)
        }
    }

    toggleActive() {
        const editor = getEditorInstanceByButton(this)

        const [ match ] = Editor.nodes(editor, {
            // @ts-ignore
            match: n => n.code === true,
            universal: true
        })
        const isCode = !!match

        // 修改 btn 样式
        const $elem = this.$elem
        const className = 'btn-active'
        if (isCode) {
            $elem.addClass(className)
        } else {
            $elem.removeClass(className)
        }

        // 记录
        this.isCode = isCode
    }
}

export default Code
