/**
 * @description entry
 * @author wangfupeng
 */

import { createEditor, Transforms } from 'slate'

const editor = createEditor()

editor.children = [
    {
        type: 'paragraph',
        children: [
          {
            text:
              "Since it's rich text, you can do things like turn a selection of text ",
          },
          // @ts-ignore
          { text: 'bold', bold: true },
          {
            text:
              ', or add a semantically rendered block quote in the middle of the page, like this:',
          },
        ],
    }
]

editor.onChange = () => {
    console.log('changed', editor.children, editor.selection)
}

Transforms.select(editor, {
    anchor: {
        path: [0, 0],
        offset: 3
    },
    focus: {
        path: [0, 0],
        offset: 5
    }
})

editor.insertText('123')

setTimeout(() => {
    editor.insertText('456')
}, 1000)

console.log(editor)
