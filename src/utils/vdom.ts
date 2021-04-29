/**
 * @description vdom 相关方法
 * @author wangfupeng
 */

import { camelCase } from 'lodash-es'
import {
    VNode,
    init,
    classModule,
    propsModule,
    styleModule,
    datasetModule
    // eventListenersModule
} from "snabbdom"

export type PatchFn = (oldVnode: VNode | Element, vnode: VNode) => VNode

/**
 * 创建 snabbdom patch
 * @returns snabbdom patch 函数
 */
export function genPatchFn(): PatchFn {
    const patch = init([
        // Init patch function with chosen modules
        classModule, // makes it easy to toggle classes
        propsModule, // for setting properties on DOM elements
        styleModule, // handles styling on elements with support for animations
        datasetModule,
        // eventListenersModule, // attaches event listeners
    ])
    return patch
}

// vnode.data 保留属性，参考 snabbdom VNodeData
const DATA_PRESERVE_KEYS = ['props', 'attrs', 'style', 'dataset', 'on', 'key', 'hook']

/**
* 整理 vnode.data ，将暴露出来的零散属性（如 id className data-xxx）放在 data.props 或 data.dataset
* @param vnode vnode
*/
export function normalizeVnodeData(vnode: VNode) {
    const { data = {}, children = [] } = vnode
    const dataKeys = Object.keys(data)
    dataKeys.forEach((key: string) => {
        // 忽略 data 保留属性
        if (DATA_PRESERVE_KEYS.includes('key')) return
 
        // 获取 value
        const value = data[key]
 
        // dataset
        if (key.startsWith('data-')) {
            let datasetKey = key.slice(5) // 截取掉最前面的 'data-'
            datasetKey = camelCase(datasetKey) // 转为驼峰写法
 
            if (data.dataset == null) data.dataset = {}
            data.dataset[datasetKey] = value // 存储到 data.dataset
 
            delete data[key] // 删掉原有的属性
            return
        }
 
        // 其他的，都算 props
        if (data.props == null) data.props = {}
        data.props[key] = value // 存储到 data.props
 
        delete data[key] // 删掉原有的属性
    })
 
    // // 遍历 children
    // if (children.length > 0) {
    //     children.forEach(child => {
    //         if (typeof child === 'string') return
    //         normalizeVnodeData(child)
    //     })
    // }
 }
