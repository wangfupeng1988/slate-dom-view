/**
 * @description 对象关联关系
 * @author wangfupeng
 */

import { IWeEditor } from '../editor/index'
import TextArea from '../text-area/TextArea'

export const TEXTAREA_TO_EDITOR = new WeakMap<TextArea, IWeEditor>()
export const EDITOR_TO_TEXTAREA = new WeakMap<IWeEditor, TextArea>()
