/**
 * @description list button
 * @author wangfupeng
 */
import { Editor, Element, Node, Transforms } from 'slate'
import $, { Dom7Array } from '../../utils/dom'
import { IToolButton, getEditorInstanceByButton } from './index'

// 检查当前节点是不是 list
function checkList(n: Node): boolean {
    if (Editor.isEditor(n)) return false
    if (Element.isElement(n)) {
        // @ts-ignore
        const { type } = n
        return type === 'bulleted-list' || type === 'numbered-list' // 两者都要考虑，都算是 list
    }
    return false
}

class List implements IToolButton {
    key = 'list'
    type: string  // 'bulleted-list' || 'numbered-list' 和 node.type 一致
    matchType: string = '' // 选区实际的 list type
    $elem: Dom7Array
    private isList: boolean = false

    /**
     * 创建 List button 实例
     * @param type 'bulleted-list' || 'numbered-list'
     */
    constructor(type = 'bulleted-list') {
        if (type !== 'bulleted-list'&& type !== 'numbered-list') {
            throw new Error(`list type '${type}' is invalid`)
        }

        this.type = type

        const elemText = type === 'bulleted-list' ? 'UL' : 'OL'
        const $elem = $(`<button>${elemText}</button>`)
        this.$elem = $elem

        $elem.on('click', this.onClick.bind(this))
    }

    private onClick() {
        const editor = getEditorInstanceByButton(this)
        const isCurTypeList = this.isList && (this.matchType === this.type)

        Transforms.unwrapNodes(editor, {
            match: checkList,
            split: true
        })
        Transforms.setNodes(editor, {
            // @ts-ignore
            type: isCurTypeList ? 'paragraph' : 'list-item'
        })
        if (!isCurTypeList || this.matchType !== this.type) {
            // 非 list 情况，或者切换 type，外层在包裹一个 listNode
            const listNode = { type: this.type, children: [] }
            Transforms.wrapNodes(editor, listNode)
        }
    }

    toggleActive() {
        const editor = getEditorInstanceByButton(this)

        const [match] = Editor.nodes(editor, {
            match: checkList
        })
        const isList = !!match
        this.isList = isList

        // 修改 btn 样式
        const $elem = this.$elem
        const className = 'btn-active'
        if (isList) {
            const [n] = match
            // @ts-ignore
            const { type } = n
            this.matchType = type // 记录选区的 type
            if (type === this.type) {
                $elem.addClass(className) // 完全匹配当前的 type ，则设置 active
                return
            }
        }
        $elem.removeClass(className) // 未匹配则取消 active
    }
}

export default List