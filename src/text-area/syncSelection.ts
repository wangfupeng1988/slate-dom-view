/**
 * @description 同步 selection
 * @author wangfupeng
 */

import { Range } from 'slate'
import scrollIntoView from 'scroll-into-view-if-needed'

import { IDomEditor, DomEditor } from '../editor/dom-editor'
import TextArea from './TextArea'
import { EDITOR_TO_ELEMENT } from '../utils/weak-maps'
import { IS_FIREFOX } from '../utils/ua'

/**
 * editor onchange 时，将 editor selection 同步给 DOM
 * @param textarea textarea
 * @param editor editor
 */
export function editorSelectionToDOM(textarea: TextArea, editor: IDomEditor): void {
    const { selection } = editor
    const domSelection = window.getSelection()

    if (!domSelection) return
    if (textarea.isComposing) return
    if (!DomEditor.isFocused(editor)) return
    

    const hasDomSelection = domSelection.type !== 'None'

    // If the DOM selection is properly unset, we're done.
    if (!selection && !hasDomSelection) return

    // verify that the dom selection is in the editor
    const editorElement = EDITOR_TO_ELEMENT.get(editor)!
    let hasDomSelectionInEditor = false
    if (
        editorElement.contains(domSelection.anchorNode) &&
        editorElement.contains(domSelection.focusNode)
    ) {
        hasDomSelectionInEditor = true
    }

    // If the DOM selection is in the editor and the editor selection is already correct, we're done.
    if (
        hasDomSelection &&
        hasDomSelectionInEditor &&
        selection &&
        Range.equals(DomEditor.toSlateRange(editor, domSelection), selection)
    ) {
        return
    }

    // Otherwise the DOM selection is out of sync, so update it.
    textarea.isUpdatingSelection = true

    const newDomRange = selection && DomEditor.toDOMRange(editor, selection)
    if (newDomRange) {
        if (Range.isBackward(selection!)) {
            domSelection.setBaseAndExtent(
                newDomRange.endContainer,
                newDomRange.endOffset,
                newDomRange.startContainer,
                newDomRange.startOffset
            )
        } else {
            domSelection.setBaseAndExtent(
                newDomRange.startContainer,
                newDomRange.startOffset,
                newDomRange.endContainer,
                newDomRange.endOffset
            )
        }

        // 滚动到选区
        const leafEl = newDomRange.startContainer.parentElement!
        scrollIntoView(leafEl, {
            scrollMode: 'if-needed',
            boundary: editorElement,
        })
    } else {
        domSelection.removeAllRanges()
    }

    setTimeout(() => {
        // COMPAT: In Firefox, it's not enough to create a range, you also need
        // to focus the contenteditable element too. (2016/11/16)
        if (newDomRange && IS_FIREFOX) {
            editorElement.focus()
        }

        textarea.isUpdatingSelection = false
    })
}

export function DOMSelectionToEditor() {

}