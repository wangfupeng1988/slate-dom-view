/**
 * @description text 样式
 * @author wangfupeng
 */

import { Text as SlateText } from 'slate'
import { jsx, VNode, VNodeStyle } from 'snabbdom'
import { addVnodeStyle } from '../../utils/vdom'

/**
 * 增加代码高亮的样式（临时写在这里，后面要单独拿出来）
 * @param leafNode slate text leaf node
 * @param textVnode textVnode
 */
function addCodeHighLightingStyle(
    leafNode: SlateText & {
        [key: string]: string
    },
    textVnode: VNode
) {
    // 根据 token type 设置高亮的颜色
    let color = ''

    if (leafNode.comment) color = 'slategray'
    if (leafNode.operator || leafNode.url) color = '#9a6e3a'
    if (leafNode.keyword) color = '#07a'
    if (leafNode.variable || leafNode.regex) color = '#e90'
    if (leafNode.number ||
        leafNode.boolean ||
        leafNode.tag ||
        leafNode.constant ||
        leafNode.symbol ||
        leafNode['attr-name'] ||
        leafNode.selector) color = '#905'
    if (leafNode.punctuation) color = '#999'
    if (leafNode.string || leafNode.char) color = '#690'
    if (leafNode.function || leafNode['class-name']) color = '#dd4a68'

    // 如果命中了关键字，则设置 style
    if (color) {
        const style = {
            fontFamily: 'monospace',
            background: 'hsla(0, 0%, 100%, .5)',
            color
        }
        addVnodeStyle(textVnode, style)
    }
}

/**
 * 给字符串增加样式
 * @param leafNode slate text leaf node
 * @param textVnode textVnode
 */
function addTextVnodeStyle(leafNode: SlateText, textVnode: VNode): VNode {
    // @ts-ignore
    const { bold, italic, underline, code, color, bgColor } = leafNode
    let styleVnode: VNode = textVnode

    // 【注意】各个样式和属性的顺序

    // @ts-ignore 增加代码高亮的样式（临时写在这里，后面要单独拿出来）
    addCodeHighLightingStyle(leafNode, styleVnode)

    if (color) {
        addVnodeStyle(styleVnode, { color })
    }
    if (bgColor) {
        addVnodeStyle(styleVnode, { backgroundColor: bgColor })
    }
    if (bold) {
        styleVnode = <strong>{styleVnode}</strong>
    }
    if (code) {
        styleVnode = <code>{styleVnode}</code>
    }
    if (italic) {
        styleVnode = <em>{styleVnode}</em>
    }
    if (underline) {
        styleVnode = <u>{styleVnode}</u>
    }

    return styleVnode
}

export default addTextVnodeStyle
