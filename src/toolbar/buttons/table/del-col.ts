/**
 * @description del col button
 * @author wangfupeng
 */

import { isEqual } from 'lodash-es'
import { Editor, Transforms, Node, Range, NodeEntry, Path } from 'slate'
import { DomEditor } from '../../../editor/dom-editor'
import $, { Dom7Array } from '../../../utils/dom'
import { IToolButton, getEditorInstanceByButton } from '../index'

class DeleteCol implements IToolButton {
    key = 'del-col'
    $elem: Dom7Array
    private isTable: boolean = false
    private curCellEntry: NodeEntry | null = null

    constructor() {
        const $elem = $('<button disabled>del col</button>')
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

        const [selectedCellNode, selectedCellPath] = curCellEntry

        // 如果只有一列，则删除整个表格
        const rowNode = DomEditor.getParentNode(editor, selectedCellNode)
        const colLength = rowNode?.children.length || 0
        if (!rowNode || colLength <= 1) {
            Transforms.removeNodes(editor, { mode: 'highest' }) // 删除整个表格
            return
        }

        // ------------------ 不只有 1 列，则继续 ------------------

        // 临时记录表格 node path ，重要！！！ 执行完之后再删除
        // 这样做，可以避免被 normalize 误伤
        const selectedTablePath = selectedCellPath.slice(0, 1)
        DomEditor.recordChangingPath(editor, selectedTablePath)

        const tableNode = DomEditor.getParentNode(editor, rowNode)
        if (tableNode == null) return

        // 遍历所有 tr
        const rows = tableNode.children || []
        rows.forEach(row => {
            // @ts-ignore
            const cells = row.children || []
            // 遍历一个 tr 的所有 td
            cells.forEach((cell: Node) => {
                const path = DomEditor.findPath(editor, cell)
                if (
                    path.length === selectedCellPath.length &&
                    isEqual(path.slice(-1), selectedCellPath.slice(-1)) // 俩数组，最后一位相同
                ) {
                    // 如果当前 td 的 path 和选中 td 的 path ，最后一位相同，说明是同一列
                    // 删除当前的 cell
                    Transforms.removeNodes(editor, { at: path })
                }
            })
        })

        // 及时删除记录，重要！！！
        DomEditor.deleteChangingPath(editor)
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

export default DeleteCol
