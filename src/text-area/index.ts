/**
 * @description text area entry
 * @author wangfupeng
 */

import TextArea from './TextArea'

export function createTextArea(textAreaContainerId: string) {
    return new TextArea(textAreaContainerId)
}
