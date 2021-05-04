/**
 * @description header button
 * @author wangfupeng
 */

import { Editor, Element, Transforms } from 'slate'
import $, { Dom7Array } from '../../utils/dom'
import { IToolButton, getEditorInstanceByButton } from './index'

class Header implements IToolButton {
    key = 'header'
    $elem: Dom7Array

    constructor() {
        const $elem = $(`
            <select>
                <option value="header1">H1</option>
                <option value="header2">H2</option>
                <option value="header3">H3</option>
                <option value="paragraph" selected>text</option>
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
            type: selectedValue
        })
    }

    toggleActive() {
        const editor = getEditorInstanceByButton(this)
        const $elem = this.$elem

        const [match] = Editor.nodes(editor, {
            match: n => {
                if (Editor.isEditor(n)) return false
                if (Element.isElement(n)) {
                    // @ts-ignore
                    const { type = '' } = n
                    return type.startsWith('header') // type 以 'header' 开头，就是标题
                }
                return false
            }
        })

        if (match == null) {
            // 选区未处于 header
            $elem.val('paragraph')
            return
        }

        // 选区处于 header
        const [n] = match
        // @ts-ignore
        const { type } = n
        $elem.val(type)
    }
}

export default Header

