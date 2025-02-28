
/**
 *
 * Compatible Chrome + Firefox for Node.innerText
 */

import type { OwnerRepo } from "../typings";

export const normalizeNodeInner = (text: string) => {
  return text.replace(/\s+/g, ' ').trim();
}

/**
* is plain text，create children no is a async function.
* @return {boolean}
* thi
*/
export const isPlainText = (node: EventTarget, isPlainTextStatus): boolean => {
  if (!(node instanceof Element)) return false;
  if (!node?.children?.length || (node.children.length && node.children[0].classList.contains('editable-menu'))) {
    isPlainTextStatus.value = true;
    return true;
  } else {
    isPlainTextStatus.value = false;
    return false;
  }
}

export const reloadPage = () => {
  location.reload();
}
