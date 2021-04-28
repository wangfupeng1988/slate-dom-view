/**
 * @description entry
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { createWe } from './editor/index'
import { createTextArea } from './text-area/index'
import $ from './utils/dom'
import { TEXTAREA_TO_EDITOR, EDITOR_TO_TEXTAREA } from './utils/weak-map'

// 创建实例
const we = createWe()
const textArea = createTextArea('editor-view-container')

// 建立关联关系，以便相互访问
TEXTAREA_TO_EDITOR.set(textArea, we)
EDITOR_TO_TEXTAREA.set(we, textArea)


// ----------------------------- 分割线 -----------------------------

// @ts-ignore
we.setContent(window.content1)

$('#btn-set-content').on('click', () => {
    // @ts-ignore
    we.setContent(window.content2)
})
$('#btn-set-selection').on('click', () => {
    Transforms.select(we, {
        anchor: {
            path: [0, 0],
            offset: 5
        },
        focus: {
            path: [0, 0],
            offset: 5
        }
    })
})
$('#btn-insert-text').on('click', () => {
    we.insertText('123456')
})
$('#btn-insert-break').on('click', () => {
    we.insertBreak()
})
