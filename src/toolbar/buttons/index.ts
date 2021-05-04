/**
 * @description buttons entry
 * @author wangfupeng
 */

import { IDomEditor } from '../../editor/dom-editor'
import { Dom7Array } from '../../utils/dom'
import { TOOLBAR_BUTTON_TO_EDITOR } from '../../utils/weak-maps'

// 引入各个 toolButton
import Bold from './bold'
import Header from './header'
import BgColor from './bgColor'

export interface IToolButton {
    key: string
    $elem: Dom7Array
    toggleActive: () => void
}

// 存储 & 注册
export const TOOL_BUTTON_LIST: IToolButton[] = []
TOOL_BUTTON_LIST.push(new Bold())
TOOL_BUTTON_LIST.push(new Header())
TOOL_BUTTON_LIST.push(new BgColor())

// 获取 editor
export function getEditorInstanceByButton(button: IToolButton): IDomEditor {
    const editor = TOOLBAR_BUTTON_TO_EDITOR.get(button)
    if (editor == null) throw new Error(`Can not get editor instance by toolButton ${JSON.stringify(button)}`)
    return editor
}
