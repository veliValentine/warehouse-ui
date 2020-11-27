import React, { useState } from 'react';

const Button = ({ gridRef, rowI, name }) => (
  <button
    onClick={() => gridRef.current.scrollToItem({
      columnIndex: 0,
      rowIndex: rowI,
      align: 'start'
    })}
  >
    {rowI === 0 ? name : //Button to top row has index 0
      `${name} @ row ${rowI}`
    }
  </button>
);

const SearchFormButtons = ({ gridRef, data }) => {
  const [search, setSearch] = useState('');

  const goTo = () => {
    if (search.trim() === '') {
      return null;
    }
    if (data) {
      //Filter data by name
      const filteredData = data.filter(item => item[0].toLowerCase().includes(search.toLowerCase().trim()));
      const l = filteredData.length;
      if (l < 1) {
        return 'No results';
      }
      if (l > 10) {
        return 'Too many results!';
      }
      //Get name and index for each found item and return Button
      return filteredData.map((item) => {
        const name = item[0];
        const i = data.indexOf(item);
        return (
          <Button key={name} gridRef={gridRef} name={name} rowI={i + 1} />
        );
      });
    }
  };

  return (
    <div>
      <form>
        <input
          onChange={(event) => setSearch(event.target.value)}
          value={search}
          placeholder={'Search product by name'}
        />
      </form>
      <p>
        <Button gridRef={gridRef} name={'Top'} rowI={0} />
        {' '}
        {goTo()}
      </p>
    </div>
  );
};

export default SearchFormButtons;