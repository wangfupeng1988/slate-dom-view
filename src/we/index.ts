/**
 * @description editor entry
 * @author wangfupeng
 */

import { createEditor } from 'slate'
import { withWe } from './plugin/withWe'

export function createWe() {
    return withWe(createEditor())
}
