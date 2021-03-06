/**
 * @description 同步 selection
 * @author wangfupeng
 */

import { Editor, Range, Transforms } from 'slate'
import scrollIntoView from 'scroll-into-view-if-needed'

import { IDomEditor, DomEditor } from '../editor/dom-editor'
import TextArea from './TextArea'
import { EDITOR_TO_ELEMENT, IS_FOCUSED } from '../utils/weak-maps'
import { IS_FIREFOX } from '../utils/ua'
import { hasEditableTarget, isTargetInsideVoid } from './helpers'
import { DOMElement } from '../utils/dom'

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
        let canReturn = true

        // 选区在 table 时，需要特殊处理
        if (Range.isCollapsed(selection)) {
            const { anchorNode, anchorOffset } = domSelection
            if (anchorNode === editorElement) {
                const childNodes = editorElement.childNodes
                let tableElem

                // 光标在 table 前面时
                tableElem = childNodes[anchorOffset] as DOMElement
                if (tableElem && tableElem.matches('table')) {
                    canReturn = false // 不能就此结束，需要重置光标
                }

                // 光标在 table 后面时
                tableElem = childNodes[anchorOffset - 1] as DOMElement
                if (tableElem && tableElem.matches('table')) {
                    canReturn = false // 不能就此结束，需要重置光标
                }
            }
        }

        // 其他情况，就此结束
        if (canReturn) return
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

/**
 * DOM selection change 时，把 DOM selection 同步给 slate
 * @param textarea textarea
 * @param editor editor
 */
export function DOMSelectionToEditor(textarea: TextArea, editor: IDomEditor) {
    const { isComposing, isUpdatingSelection } = textarea
    const config = editor.getConfig()
    if (config.readOnly) return
    if (isComposing) return
    if (isUpdatingSelection) return

    const { activeElement } = window.document
    const el = DomEditor.toDOMNode(editor, editor)
    const domSelection = window.getSelection()

    if (activeElement === el) {
        textarea.latestElement = activeElement
        IS_FOCUSED.set(editor, true)
    } else {
        IS_FOCUSED.delete(editor)
    }

    if (!domSelection) {
        return Transforms.deselect(editor)
    }

    const { anchorNode, focusNode } = domSelection

    const anchorNodeSelectable =
        hasEditableTarget(editor, anchorNode) ||
        isTargetInsideVoid(editor, anchorNode)
    const focusNodeSelectable =
        hasEditableTarget(editor, focusNode) ||
        isTargetInsideVoid(editor, focusNode)

    if (anchorNodeSelectable && focusNodeSelectable) {
        const range = DomEditor.toSlateRange(editor, domSelection)
        Transforms.select(editor, range)
    } else {
        Transforms.deselect(editor)
    }
}
