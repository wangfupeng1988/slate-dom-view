/**
 * @description slate 插件（参考 slate-react with-react.ts ，会增加代码解读注释）
 * @author wangfupeng
 */

import { Editor, Node, Path, Operation, Transforms, Range } from 'slate'
import { IDomEditor, DomEditor } from './dom-editor'
import { EDITOR_TO_ON_CHANGE, NODE_TO_KEY, EDITOR_TO_CONFIG, NODE_TO_PARENT } from '../utils/weak-maps'
import { Key } from '../utils/key'
import { isDOMText, getPlainText } from '../utils/dom'
import { IConfig } from '../config/index'

/**
 * `withDOM` adds DOM specific behaviors to the editor.
 */
export const withDOM = <T extends Editor>(editor: T) => {
    const e = editor as T & IDomEditor
    const { apply, onChange, isVoid, isInline, insertBreak } = e

    // 重写 apply 方法
    // apply 方法非常重要，它最终执行 operation https://docs.slatejs.org/concepts/05-operations
    // operation 的接口定义参考 slate src/interfaces/operation.ts
    e.apply = (op: Operation) => {
        const matches: [Path, Key][] = []

        switch (op.type) {
            case 'insert_text':
            case 'remove_text':
            case 'set_node': {
                for (
                    const [node, path] of Editor.levels(e, { at: op.path }) // 在当前节点寻找
                ) {
                    const key = DomEditor.findKey(e, node)
                    matches.push([path, key])
                }
                break
            }

            case 'insert_node':
            case 'remove_node':
            case 'merge_node':
            case 'split_node': {
                for (
                    const [node, path] of Editor.levels(e, { at: Path.parent(op.path)}) // 在父节点寻找
                ) {
                    const key = DomEditor.findKey(e, node)
                    matches.push([path, key])
                }
                break
            }

            case 'move_node': {
                // TODO
                // 这里是否可以执行 NODE_TO_KEY.delete(node) ？？？
                break
            }
        }

        // 执行原本的 apply - 重要！！！
        apply(op)

        // 绑定 node 和 key
        for (const [path, key] of matches) {
            const [node] = Editor.node(e, path)
            NODE_TO_KEY.set(node, key)
        }
    }

    // 待详细注释 ？？？
    e.setFragmentData = (data: DataTransfer) => {
        const { selection } = e

        if (!selection) {
            return
        }

        // 获取开始、结束两个 point { path, offset }
        const [start, end] = Range.edges(selection)
        // Editor.void - Match a void node in the current branch of the editor.
        const startVoid = Editor.void(e, { at: start.path })
        const endVoid = Editor.void(e, { at: end.path })

        if (Range.isCollapsed(selection) && !startVoid) {
            return
        }

        // Create a fake selection so that we can add a Base64-encoded copy of the
        // fragment to the HTML, to decode on future pastes.
        const domRange = DomEditor.toDOMRange(e, selection)
        let contents = domRange.cloneContents()
        let attach = contents.childNodes[0] as HTMLElement

        // Make sure attach is non-empty, since empty nodes will not get copied.
        contents.childNodes.forEach(node => {
            if (node.textContent && node.textContent.trim() !== '') {
                attach = node as HTMLElement
            }
        })

        // COMPAT: If the end node is a void node, we need to move the end of the
        // range from the void node's spacer span, to the end of the void node's
        // content, since the spacer is before void's content in the DOM.
        if (endVoid) {
            const [voidNode] = endVoid
            const r = domRange.cloneRange()
            const domNode = DomEditor.toDOMNode(e, voidNode)
            r.setEndAfter(domNode)
            contents = r.cloneContents()
        }
    
        // COMPAT: If the start node is a void node, we need to attach the encoded
        // fragment to the void node's content node instead of the spacer, because
        // attaching it to empty `<div>/<span>` nodes will end up having it erased by
        // most browsers. (2018/04/27)
        if (startVoid) {
            attach = contents.querySelector('[data-slate-spacer]')! as HTMLElement
        }
    
        // Remove any zero-width space spans from the cloned DOM so that they don't
        // show up elsewhere when pasted.
        Array.from(contents.querySelectorAll('[data-slate-zero-width]')).forEach(
            zw => {
                const isNewline = zw.getAttribute('data-slate-zero-width') === 'n'
                zw.textContent = isNewline ? '\n' : ''
            }
        )
    
        // Set a `data-slate-fragment` attribute on a non-empty node, so it shows up
        // in the HTML, and can be used for intra-Slate pasting. If it's a text
        // node, wrap it in a `<span>` so we have something to set an attribute on.
        if (isDOMText(attach)) {
            const span = document.createElement('span')
            // COMPAT: In Chrome and Safari, if we don't add the `white-space` style
            // then leading and trailing spaces will be ignored. (2017/09/21)
            span.style.whiteSpace = 'pre'
            span.appendChild(attach)
            contents.appendChild(span)
            attach = span
        }
    
        const fragment = e.getFragment()
        const string = JSON.stringify(fragment)
        const encoded = window.btoa(encodeURIComponent(string))
        attach.setAttribute('data-slate-fragment', encoded)
        data.setData('application/x-slate-fragment', encoded)
    
        // Add the content to a <div> so that we can get its inner HTML.
        const div = document.createElement('div')
        div.appendChild(contents)
        div.setAttribute('hidden', 'true')
        document.body.appendChild(div)
        data.setData('text/html', div.innerHTML)
        data.setData('text/plain', getPlainText(div))
        document.body.removeChild(div)
    }

    // 待详细注释 ？？？
    e.insertData = (data: DataTransfer) => {
        const fragment = data.getData('application/x-slate-fragment')

        if (fragment) {
            const decoded = decodeURIComponent(window.atob(fragment))
            const parsed = JSON.parse(decoded) as Node[]
            e.insertFragment(parsed)
            return
        }

        const text = data.getData('text/plain')

        if (text) {
            const lines = text.split(/\r\n|\r|\n/)
            let split = false

            for (const line of lines) {
                if (split) {
                    Transforms.splitNodes(e, { always: true })
                }

                e.insertText(line)
                split = true
            }
        }

        // TODO data.files 拖拽上传图片，可参考 https://github.com/ianstormtaylor/slate/blob/main/site/examples/images.tsx
    }

    // 获取 editor 配置信息
    e.getConfig = (): IConfig => {
        const config = EDITOR_TO_CONFIG.get(e)
        if (config == null) throw new Error('Can not get editor config')
        return config
    },

    // 重写 onchange API
    e.onChange = () => {
        // 触发配置的 onchange 事件
        const onContextChange = EDITOR_TO_ON_CHANGE.get(e)
        if (onContextChange) {
            onContextChange()
        }

        onChange()
    }

    // 重写 isVoid
    e.isVoid = elem => {
        // @ts-ignore
        const { type } = elem

        if (type === 'image') {
            return true
        }
        if (type === 'video') {
            return true
        }

        return isVoid(elem)
    }

    // 重写 isInline
    e.isInline = elem => {
        // @ts-ignore
        const { type } = elem

        if (type === 'image') {
            return true
        }
        if (type === 'link') {
            return true
        }

        return isInline(elem)
    }

    // 重写 insertBreak ，自定义回车换行 —— 后面要拆分出去，每个功能单独处理？？？
    e.insertBreak = () => {
        // -------------------- code block --------------------
        const [matchForCodeBlock] = Editor.nodes(e, {
            // @ts-ignore
            match: n => n.type === 'pre',
            universal: true
        })
        if (!!matchForCodeBlock) {
            // 命中了 pre 节点
            const [n] = matchForCodeBlock
            const codeStr = Node.string(n)
            if (codeStr.slice(-2) === '\n\n') {
                // 结尾两处空行，则跳出 pre ，插入空行
                const emptyP = { type: 'paragraph', children: [{text: ''}] }
                Transforms.insertNodes(editor, emptyP, {
                    mode: 'highest' // 在最高层级插入，否则会插入到 pre 下面
                })
            } else {
                e.insertText('\n') // 文本换行
            }

            return // 阻止默认的 insertBreak ，重要
        }

        // -------------------- list item --------------------
        const [matchForListItem] = Editor.nodes(e, {
            // @ts-ignore
            match: n => n.type === 'list-item',
            universal: true
        })
        if (!!matchForListItem) {
            // 命中了 list-item 节点
            const [n] = matchForListItem
            const listNode = NODE_TO_PARENT.get(n) // 获取 list-item 的父节点，即 list 节点
            const children = listNode?.children || []
            const childrenLength = children.length
            if (n === children[childrenLength - 1]) {
                // 当前 list-item 是 list 的最后一个 child
                const str = Node.string(n)
                if (str === '') {
                    // 当前 list-item 无内容。则跳出 list ，插入一个空行
                    const emptyP = { type: 'paragraph', children: [{text: ''}] }
                    Transforms.insertNodes(editor, emptyP, {
                        mode: 'highest' // 在最高层级插入，否则会插入到 list 下面
                    })

                    return // 阻止默认的 insertBreak ，重要
                }
            }
        }

        insertBreak()
    }

    // 最后要返回 editor 实例 - 重要！！！
    return e
}
