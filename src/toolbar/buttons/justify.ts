/**
 * @description justify button
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import $, { Dom7Array } from '../../utils/dom'
import { IToolButton, getEditorInstanceByButton } from './index'

class Justify implements IToolButton {
    key = 'justify'
    $elem: Dom7Array

    constructor() {
        const $elem = $(`
            <select>
                <option value="default" selected>默认</option>
                <option value="left">left</option>
                <option value="right">right</option>
                <option value="center">center</option>
            </select>
        `)
        this.$elem = $elem

        $elem.on('change', this.onChange.bind(this))
    }

    onChange() {
        const editor = getEditorInstanceByButton(this)
        const $elem = this.$elem
        const selectedValue = $elem.val()

        Transforms.setNodes(editor, {
            // @ts-ignore
            textAlign: selectedValue === 'default'
                ? null // 设置为 null 即删除该属性
                : selectedValue
        })
    }

    toggleActive() {
        const editor = getEditorInstanceByButton(this)
        const $elem = this.$elem

        const [ match ] = Editor.nodes(editor, {
            // @ts-ignore
            match: n => n.textAlign && n.textAlign !== 'default',
            universal: true
        })

        if (match == null) {
            // 选区没有 textAlign
            $elem.val('default')
            return
        }

        // 选区有 textAlign
        const [n] = match
        // @ts-ignore
        const { textAlign } = n
        $elem.val(textAlign)
    }
}

export default Justify
