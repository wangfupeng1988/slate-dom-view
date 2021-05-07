/**
 * @description code highlighting decorate
 * @author wangfupeng
 */

import { Node, NodeEntry, Range, Text } from 'slate'
import Prism from 'prismjs'
import { NODE_TO_PARENT } from '../utils/weak-maps'

// @ts-ignore
function getTokenLength(token) {
    if (typeof token === 'string') {
        return token.length
    } else if (typeof token.content === 'string') {
        return token.content.length
    } else {
        // 累加 length
        return token.content.reduce(
            // @ts-ignore
            (l, t) => l + getTokenLength(t),
            0
        )
    }
}

/**
 * 检查 node 是否在代码块中
 * @param node node
 */
function checkNode(node: Node): boolean {
    if (!Text.isText(node)) return false // 非文本

    const codeNode = NODE_TO_PARENT.get(node)
    // @ts-ignore 确定上级是 code 节点
    if (codeNode && codeNode.type === 'code') {
        const preNode = NODE_TO_PARENT.get(codeNode)
        // @ts-ignore 确定上上级是 pre 节点
        if (preNode && preNode.type === 'pre') {
            return true
        }
    }

    return false
}

const codeHighLightingDecorate = (nodeEntry: NodeEntry): Range[] => {
    const [n, path] = nodeEntry
    const ranges: Range[] = []

    // 节点不合法，则不处理
    if (!checkNode(n)) return ranges
    const node = n as Text

    const tokens = Prism.tokenize(node.text, Prism.languages.javascript)

    // console.log('tokens', tokens)
    // tokens 即 Prism 对整个字符串的拆分，有普通文字也有高亮的关键字
    // 例如 `const a = 100;` 的 tokens 是一个数组 [ token, ' a ', token, ' ', token ] ，有对象有字符串，对象就表示关键字
    // 如数组第一个 token 是 { type: "keyword", content: "const" } 。关键字类型不同 type 也不同

    let start = 0
    for (const token of tokens) {
        const length = getTokenLength(token)
        const end = start + length

        if (typeof token !== 'string') {
            // 遇到关键字，则拆分多个 range —— decorate 规则
            ranges.push({
                [token.type]: true, // 记录类型，以便 css 使用不同的颜色
                anchor: { path, offset: start },
                focus: { path, offset: end },
            })
        }

        start = end
    }

    return ranges
}

export default codeHighLightingDecorate
