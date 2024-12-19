// markdown plugin
module.exports = (md, ctx) => {
  function setLine({ tokens = [] }) {
    for (let i = 0; i < tokens.length; i++) {
      const item = tokens[i];
      if (item.nesting !== -1 && item.block === true) {
        item.attrs = [["data-editable-line", item.map ? item.map[0] : i + 1]];
      }
    }
  }

  md.core.ruler.before("linkify", "editable", setLine);
};
