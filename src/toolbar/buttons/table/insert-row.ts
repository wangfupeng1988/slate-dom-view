/**
 * @description insert row button
 * @author wangfupeng
 */

import { Editor, Transforms, Node, Range, NodeEntry, Path } from 'slate'
import { DomEditor } from '../../../editor/dom-editor'
import $, { Dom7Array } from '../../../utils/dom'
import { IToolButton, getEditorInstanceByButton } from '../index'

class InsertRow implements IToolButton {
    key = 'insert-row'
    $elem: Dom7Array
    private isTable: boolean = false
    private curCellEntry: NodeEntry | null = null

    constructor() {
        const $elem = $('<button disabled>insert row</button>')
        this.$elem = $elem

        $elem.on('click', this.onClick.bind(this))
    }

    private onClick() {
        const { isTable, curCellEntry } = this
        if (!isTable) return
        if (curCellEntry == null) return

        const editor = getEditorInstanceByButton(this)
        const { selection } = editor
        if (selection == null || !Range.isCollapsed(selection)) return

        const [cellNode, cellPath] = curCellEntry

        // 获取 cell length 即多少列
        const rowNode = DomEditor.getParentNode(editor, cellNode)
        const cellsLength = rowNode?.children.length || 0
        if (cellsLength === 0) return

        // 拼接新插入的 tr
        const newRow = { type: 'table-row', children: [] }
        for (let i = 0; i < cellsLength; i++) {
            newRow.children.push({
                // @ts-ignore
                type: 'table-cell', children: [{ text: '' }]
            })
        }

        // 插入 tr
        const rowPath = Path.parent(cellPath) // 获取 tr 的 path
        const newRowPath = Path.next(rowPath)
        Transforms.insertNodes(editor, newRow, { at: newRowPath })
    }

    toggleActive() {
        const editor = getEditorInstanceByButton(this)
        const { selection } = editor

        const [ cellEntry ] = Editor.nodes(editor, {
            // @ts-ignore
            match: n => n.type === 'table-cell',
            universal: true
        })
        const isTable = !!cellEntry
        this.curCellEntry = cellEntry

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

export default InsertRow
