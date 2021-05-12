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
import Justify from './justify'
import Link from './link'
import Image from './img'
import Mention from './mention'
import List from './list'
import Code from './code'
import CodeBlock from './code-block'
import Formula from './formula'

import Table from './table/table'
import InsertRow from './table/insert-row'
import DeleteRow from './table/del-row'
import InsertCol from './table/insert-col'
import DeleteCol from './table/del-col'

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
TOOL_BUTTON_LIST.push(new Justify())
TOOL_BUTTON_LIST.push(new List('bulleted-list'))
TOOL_BUTTON_LIST.push(new List('numbered-list'))
TOOL_BUTTON_LIST.push(new Link())
TOOL_BUTTON_LIST.push(new Image())
TOOL_BUTTON_LIST.push(new Mention())
TOOL_BUTTON_LIST.push(new Code())
TOOL_BUTTON_LIST.push(new CodeBlock())
TOOL_BUTTON_LIST.push(new Formula())

TOOL_BUTTON_LIST.push(new Table())
TOOL_BUTTON_LIST.push(new InsertRow())
TOOL_BUTTON_LIST.push(new DeleteRow())
TOOL_BUTTON_LIST.push(new InsertCol())
TOOL_BUTTON_LIST.push(new DeleteCol())


// 获取 editor
export function getEditorInstanceByButton(button: IToolButton): IDomEditor {
    const editor = TOOLBAR_BUTTON_TO_EDITOR.get(button)
    if (editor == null) throw new Error(`Can not get editor instance by toolButton ${JSON.stringify(button)}`)
    return editor
}
