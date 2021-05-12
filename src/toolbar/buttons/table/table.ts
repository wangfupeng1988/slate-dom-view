/**
 * @description insert table button
 * @author wangfupeng
 */

import { Editor, Transforms, Node } from 'slate'
import $, { Dom7Array } from '../../../utils/dom'
import { IToolButton, getEditorInstanceByButton } from '../index'

function genTableNode() {
    return {
        type: 'table',
        children: [
            {
                type: 'table-row',
                children: [
                    { type: 'table-cell', children: [{ text: '' }] },
                    { type: 'table-cell', children: [{ text: '' }] },
                    { type: 'table-cell', children: [{ text: '' }] },
                    { type: 'table-cell', children: [{ text: '' }] },
                ]
            },
            {
                type: 'table-row',
                children: [
                    { type: 'table-cell', children: [{ text: '' }] },
                    { type: 'table-cell', children: [{ text: '' }] },
                    { type: 'table-cell', children: [{ text: '' }] },
                    { type: 'table-cell', children: [{ text: '' }] },
                ]
            }
        ]
    }
}

class InsertAndDelTable implements IToolButton {
    key = 'table'
    $elem: Dom7Array
    private isTable: boolean = false

    constructor() {
        const $elem = $('<button>insert table</button>')
        this.$elem = $elem

        $elem.on('click', this.onClick.bind(this))
    }

    private onClick() {
        const editor = getEditorInstanceByButton(this)
        const isTable = this.isTable

        // 删除表格
        if (isTable) {
            Transforms.removeNodes(editor, { mode: 'highest' })
            return
        }

        // 插入表格
        const [ match ] = Editor.nodes(editor, {
            // @ts-ignore
            match: n => n.type === 'paragraph',
            universal: true
        })
        if (match) {
            // 当前处于空 p ，则删掉该 p
            const [ p ] = match
            if (Node.string(p) === '') {
                Transforms.removeNodes(editor, { mode: 'highest' })
            }
        }

        const tableNode = genTableNode()
        Transforms.insertNodes(editor, tableNode, { mode: 'highest' })
    }

    toggleActive() {
        const editor = getEditorInstanceByButton(this)

        const [ match ] = Editor.nodes(editor, {
            // @ts-ignore
            match: n => n.type === 'table',
            universal: true
        })
        const isTable = !!match

        // 修改 btn 样式
        const $elem = this.$elem
        if (isTable) {
            $elem.text('del table')
        } else {
            $elem.text('insert table')
        }

        // 记录
        this.isTable = isTable
    }
}

export default InsertAndDelTable
