/**
 * @description formula button
 * @author wangfupeng
 */

import { Editor, Element, Node, NodeEntry, Transforms } from 'slate'
import $, { Dom7Array } from '../../utils/dom'
import { IToolButton, getEditorInstanceByButton } from './index'

/**
 * 检查 node 是否是 formula
 * @param n slate node
 */
function checkFormula(n: Node): boolean {
    if (Editor.isEditor(n)) return false
    if (Element.isElement(n)) {
        // @ts-ignore
        return n.type === 'formula'
    }
    return false
}

class Formula implements IToolButton {
    key = 'mention'
    $elem: Dom7Array
    private selectedNodeEntry: NodeEntry | null = null

    constructor() {
        const $elem = $('<button>∑</button>')
        this.$elem = $elem

        $elem.on('click', this.onClick.bind(this))
    }

    private onClick() {
        if (this.selectedNodeEntry) {
            // 以选中，则修改
            this.changeFormula()
        } else {
            // 未选中，则插入
            this.insertFormula()
        }
    }

    private insertFormula() {
        const value = prompt('', '')
        if (!value) return

        const editor = getEditorInstanceByButton(this)
        const newNode = { type: 'formula', value, children: [{ text: '' }] } // void node 需要一个空 text 作为 children
        Transforms.insertNodes(editor, newNode)
    }

    private changeFormula() {
        const [ selectedNode, path ] = this.selectedNodeEntry as NodeEntry
        // @ts-ignore
        const { value = '' } = selectedNode

        const newValue = prompt('', value)
        if (!newValue) return

        const editor = getEditorInstanceByButton(this)
        Transforms.setNodes(editor, {
            // @ts-ignore
            value: newValue
        }, { at: path })
    }

    toggleActive() {
        const editor = getEditorInstanceByButton(this)

        const [ nodeEntry ] = Editor.nodes(editor, {
            match: checkFormula
        })
        if (nodeEntry) {
            this.selectedNodeEntry = nodeEntry
        } else {
            this.selectedNodeEntry = null // 及时清空
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

export default Formula
