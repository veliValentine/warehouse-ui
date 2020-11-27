import React from 'react';

import { FixedSizeGrid as WindowList } from 'react-window';

const Row = ({ style, columnIndex, rowIndex, data }) => {
  const item = data[rowIndex];
  if (rowIndex === 0) {
    style = {
      ...style,
      fontWeight: 'bold',
      fontSize: 'larger',
    };
  }
  return (
    <div style={{ ...style, border: 'thin solid black' }}>
      {columnIndex !== 0 || rowIndex === 0 ?
        <div style={{ padding: 5 }}>{item[columnIndex]}</div> :
        //Add row number for first column
        <div style={{ padding: 5 }}>{rowIndex + ' ' + item[columnIndex]}</div>
      }
    </div>
  );
};

const Table = ({ data, product, gridRef }) => (
  <div>
    <p>{data.length} {product} in database</p>
    <WindowList
      height={screen.height - 250}
      width={screen.width - 50}
      columnCount={5}
      columnWidth={screen.width > 600 ? (screen.width - 70) / 5 : 150}// Text is shown with smaller device
      rowHeight={50}
      rowCount={data.length + 1}
      overscanRowCount={50}
      itemData={[{ //Add table header
        0: 'Name',
        1: 'Manufacturer',
        2: 'Color',
        3: 'Price',
        4: 'Availability'
      }].concat(data)}
      ref={gridRef}
    >
      {Row}
    </WindowList>
  </div>
);

export default Table;