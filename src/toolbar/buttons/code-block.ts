/**
 * @description code-block button
 * @author wangfupeng
 */

import { Editor, Node, Transforms } from 'slate'
import $, { Dom7Array } from '../../utils/dom'
import { IToolButton, getEditorInstanceByButton } from './index'

class CodeBlock implements IToolButton {
    key = 'codeBlock'
    $elem: Dom7Array
    private isCodeBlock: boolean = false
    private preNode: Node | null = null

    constructor() {
        const $elem = $('<button>CodeBlock</button>')
        this.$elem = $elem

        $elem.on('click', this.onClick.bind(this))
    }

    private onClick() {
        const { isCodeBlock, preNode } = this
        if (isCodeBlock && preNode) {
            this.wrapCodeBlock()
        } else {
            this.unWrapCodeBlock()
        }
    }

    private wrapCodeBlock() {
        const editor = getEditorInstanceByButton(this)
        const { preNode } = this
        if (preNode == null) return

        const str = Node.string(preNode)

        // 删除当前最高层级的节点，即 pre 节点
        Transforms.removeNodes(editor, { mode: 'highest' })

        // 删除 p 节点
        const pList = str.split('\n').map(s => {
            return { type: 'paragraph', children: [{ text: s }] }
        })
        Transforms.insertNodes(editor, pList, { mode: 'highest' })
    }

    private unWrapCodeBlock() {
        const editor = getEditorInstanceByButton(this)

        const strArr = []
        const matches = Editor.nodes(editor, {
            match: n => editor.children.includes(n), // 匹配选中的最高层级的节点
            universal: true
        })
        for (let match of matches) {
            const [n] = match
            if (n) strArr.push(Node.string(n))
        }

        // 删除选中的最高层级的节点
        Transforms.removeNodes(editor, { mode: 'highest' })

        // 插入 pre 节点
        const newPreNode = {
            type: 'pre',
            children: [
                {
                    type: 'code',
                    language: 'javascript',
                    children: [
                        {text: strArr.join('\n')} // 选中节点的纯文本
                    ]
                }
            ]
        }
        Transforms.insertNodes(editor, newPreNode, { mode: 'highest' })
    }

    toggleActive() {
        const editor = getEditorInstanceByButton(this)

        const [ match ] = Editor.nodes(editor, {
            // @ts-ignore
            match: n => n.type === 'pre',
            universal: true
        })
        const isCodeBlock = !!match

        // 记录 pre 节点，修改 btn 样式
        const $elem = this.$elem
        const className = 'btn-active'
        if (isCodeBlock) {
            const [n] = match
            this.preNode = n
            $elem.addClass(className)
        } else {
            this.preNode = null
            $elem.removeClass(className)
        }

        // 记录
        this.isCodeBlock = isCodeBlock
    }
}

export default CodeBlock
