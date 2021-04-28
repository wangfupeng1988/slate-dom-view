/**
 * @description DOM 操作 ，借助 DOM7，文档 https://framework7.io/docs/dom7.html
 * @author wangfupeng
 */

import { $, css, append, addClass, on, focus, attr, hide, scrollTop, offset, parents, is, dataset } from 'dom7'
export { Dom7Array } from 'dom7'

$.fn.css = css
$.fn.append = append
$.fn.addClass = addClass
$.fn.on = on
$.fn.focus = focus
$.fn.attr = attr
$.fn.hide = hide
$.fn.scrollTop = scrollTop
$.fn.offset = offset
$.fn.parents = parents
$.fn.is = is
$.fn.dataset = dataset

export default $

/**
 * 获取 dataset value
 * @param elem elem
 * @param key dataset key
 */
export function getElemDatasetVal(elem: Node | Element | HTMLElement, key: string): string | null {
    const data = (elem as HTMLElement)?.dataset
    return data[key] || null
}
