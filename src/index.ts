/**
 * @description entry
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import createWangEditor from './create-editor'
import $ from './utils/dom'

// ----------------------------- 分割线 -----------------------------

// @ts-ignore
const we = createWangEditor('editor-view-container', window.content, {
    onChange() {
        $('#span-selection').text(JSON.stringify(we.selection))
        $('#text-content').val(JSON.stringify(we.children, null, 2))
    }
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
