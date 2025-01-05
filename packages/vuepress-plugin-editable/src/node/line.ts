// markdown plugin
function setLine({ tokens = [] }) {
  for (let i = 0; i < tokens.length; i++) {
    const item: any = tokens[i];
    if (item.nesting !== -1 && item.block === true) {
      item.attrs = [['data-editable-line', item.map ? item.map[0] : i + 1]];
    }
  }
}

export const generateLine = (md: any) => {
  md.core.ruler.before('linkify', 'editable', setLine);
};
