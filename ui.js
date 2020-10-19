const blessed = require('blessed');
const contrib = require('blessed-contrib');

exports.createUi = () => {
  // Create a screen object.
  const screen = blessed.screen({
    smartCSR: true,
    title: 'RSS Feed',
    fullUnicode: true
  });

  const grid = new contrib.grid({
      rows: 5,
      cols: 3,
      screen
  });

  const categoryList = grid.set(0,0,2,1, blessed.list, {
      keys: true,
      parent: screen,
      label: 'Category',
      selectedFg: 'black',
      selectedBg: 'white',
      align: 'left',
      border: { type: 'line' },
      style: {
          fg: 'white',
          bg: 234,
          border: {
              fg: 'cyan',
              bg: 234
          },
          label: {
              bg: 234
          }
      },
      noCellBorders: true,
      tags: true,
      wrap: false,
  });

  const feedList = grid.set(0, 1, 2, 1, blessed.list, {
      keys: true,
      parent: screen,
      label: 'Feed',
      selectedFg: 'black',
      selectedBg: 'white',
      align: 'left',
      border: { type: 'line' },
      style: {
          fg: 'white',
          bg: 234,
          border: {
              fg: 'cyan',
              bg: 234
          },
          label: {
              bg: 234
          }
      },
      noCellBorders: true,
      tags: true,
      wrap: false,
  });

  const itemList = grid.set(0, 2, 2, 1, blessed.list, {
      keys: true,
      parent: screen,
      label: 'Item',
      selectedFg: 'black',
      selectedBg: 'white',
      align: 'left',
      border: { type: 'line' },
      style: {
          fg: 'white',
          bg: 234,
          border: {
              fg: 'cyan',
              bg: 234
          },
          label: {
              bg: 234
          }
      },
      noCellBorders: true,
      tags: true,
      wrap: false,
  });

  const articleTextField = grid.set(2, 0, 3, 3, blessed.box, {
      keys: true,
      parent: screen,
      label: 'article',
      border: { type: 'line' },
      style: {
          fg: 'white',
          bg: 234,
          border: {
              fg: 'cyan',
              bg: 234
          },
          label: {
              bg: 234
          }
      },
      noCellBorders: true,
      wrap: true,
      scrollable: true,
      alwaysScroll: true
  });

  articleTextField.key(['left'], () => itemList.focus());
  itemList.key(['left'], () => feedList.focus());
  feedList.key(['left'], () => categoryList.focus());
  screen.key(['q', 'C-[', 'C-c'], () => process.exit(0));

  return {"categoryList":categoryList, "feedList":feedList, "itemList":itemList, "articleTextField":articleTextField, "screen":screen}
}
