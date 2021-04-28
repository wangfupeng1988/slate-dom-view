/**
 * @description entry
 * @author wangfupeng
 */

import $ from './utils/dom'
import { Transforms } from 'slate'
import { createWe } from './we/index'
import { createTextArea } from './text-area/index'

const we = createWe()
const textArea = createTextArea('editor-view-container')



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
