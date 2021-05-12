/**
 * @description del row button
 * @author wangfupeng
 */

import { Editor, Transforms, Node, Range, NodeEntry, Path } from 'slate'
import { DomEditor } from '../../../editor/dom-editor'
import $, { Dom7Array } from '../../../utils/dom'
import { IToolButton, getEditorInstanceByButton } from '../index'

class DeleteRow implements IToolButton {
    key = 'del-row'
    $elem: Dom7Array
    private isTable: boolean = false
    private curRowEntry: NodeEntry | null = null

    constructor() {
        const $elem = $('<button disabled>del row</button>')
        this.$elem = $elem

        $elem.on('click', this.onClick.bind(this))
    }

    private onClick() {
        const { isTable, curRowEntry } = this
        if (!isTable) return
        if (curRowEntry == null) return

        const editor = getEditorInstanceByButton(this)
        const { selection } = editor
        if (selection == null || !Range.isCollapsed(selection)) return

        const [rowNode, rowPath] = curRowEntry

        const tableNode = DomEditor.getParentNode(editor, rowNode)
        const rowsLength = tableNode?.children.length || 0
        if (rowsLength <= 1) {
            // 只有一行，则删掉整个表格
            Transforms.removeNodes(editor, { mode: 'highest' })
            return
        }

        // 删掉这一行
        Transforms.removeNodes(editor, { at: rowPath })
    }

    toggleActive() {
        const editor = getEditorInstanceByButton(this)
        const { selection } = editor

        const [ rowEntry ] = Editor.nodes(editor, {
            // @ts-ignore
            match: n => n.type === 'table-row',
            universal: true
        })
        const isTable = !!rowEntry
        this.curRowEntry = rowEntry

        // 修改 btn 样式
        const $elem = this.$elem
        if (isTable && selection && Range.isCollapsed(selection)) {
            $elem.removeAttr('disabled')
        } else {
            $elem.attr('disabled', 'true')
        }

        // 记录
        this.isTable = isTable
    }
}

export default DeleteRow
