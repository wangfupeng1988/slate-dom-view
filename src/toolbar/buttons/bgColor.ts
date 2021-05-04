/**
 * @description bgColor button
 * @author wangfupeng
 */

import { Editor } from 'slate'
import $, { Dom7Array } from '../../utils/dom'
import { IToolButton, getEditorInstanceByButton } from './index'

class BgColor implements IToolButton {
    key = 'bgColor'
    $elem: Dom7Array

    constructor() {
        const $elem = $(`
            <select>
                <option value="red">red</option>
                <option value="green">green</option>
                <option value="yellow">yellow</option>
                <option value="none" selected>none</option>
            </select>
        `)
        this.$elem = $elem

        $elem.on('change', this.onChange.bind(this))
    }

    onChange() {
        const editor = getEditorInstanceByButton(this)
        const $elem = this.$elem
        const selectedValue = $elem.val()

        if (selectedValue === 'none') {
            Editor.removeMark(editor, 'bgColor')
        } else {
            Editor.addMark(editor, 'bgColor', selectedValue)
        }
    }

    toggleActive() {
        const editor = getEditorInstanceByButton(this)
        const $elem = this.$elem

        const [ match ] = Editor.nodes(editor, {
            // @ts-ignore
            match: n => n.bgColor && n.bgColor !== 'none',
            universal: true
        })

        if (match == null) {
            // 选区没有 bgColor
            $elem.val('none')
            return
        }

        // 选区有 bgColor
        const [n] = match
        // @ts-ignore
        const { bgColor } = n
        $elem.val(bgColor)
    }
}

export default BgColor
