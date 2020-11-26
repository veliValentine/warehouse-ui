import React, { useState } from 'react';

import { title } from '../misc';

const Button = ({ buttonTexts, setProduct }) => buttonTexts.map(button => <button key={button} onClick={() => setProduct(button)}>{title(button)}</button>);

const Buttons = ({ setProduct }) => {
  const [buttonTexts, setButtonText] = useState(['shirts', 'jackets', 'accessories']);
  const [newButtonText, setNewButtonText] = useState('');

  const newButton = (event) => {
    event.preventDefault();
    if (newButtonText) {
      setButtonText(buttonTexts.concat(newButtonText));
    }
    setNewButtonText('');
  };

  return (
    <div>
      <Button setProduct={setProduct} buttonTexts={buttonTexts} />
      <form onSubmit={newButton}>
        <input
          value={newButtonText}
          onChange={(event) => setNewButtonText(event.target.value)}
          placeholder={'add new product'}
        />
        <button type='submit'>add!</button>
      </form>
    </div>
  );
};

export default Buttons;