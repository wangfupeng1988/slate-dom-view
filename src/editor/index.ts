/**
 * @description editor entry
 * @author wangfupeng
 */

import { createEditor } from 'slate'
import { withWe } from './plugin/withWe'

export * from './plugin/WeEditor'

export function createWe() {
    return withWe(createEditor())
}
