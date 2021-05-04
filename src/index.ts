/**
 * @description entry
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import createWangEditor from './create-editor'
import $ from './utils/dom'

// ----------------------------- 分割线 -----------------------------

const editor = createWangEditor(
    {
        containerId: 'editor-view-container',
        toolbarId: 'editor-toolbar'
    },
    // @ts-ignore
    window.content,
    {
        onChange() {
            console.log('--- editor changed ---', editor)

            $('#span-selection').text(JSON.stringify(editor.selection))
            $('#text-content').val(JSON.stringify(editor.children, null, 2))
        }
    }
)

// $('#btn-set-selection').on('click', () => {
//     Transforms.select(editor, {
//         anchor: {
//             path: [0, 0],
//             offset: 5
//         },
//         focus: {
//             path: [0, 0],
//             offset: 5
//         }
//     })
// })
// $('#btn-insert-text').on('click', () => {
//     editor.insertText('123456')
// })
// $('#btn-insert-break').on('click', () => {
//     editor.insertBreak()
// })
