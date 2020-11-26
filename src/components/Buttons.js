import React, { useState } from 'react';

import { title } from '../misc';

const Button = ({ buttonTexts, setProduct }) => buttonTexts.map(button => <button key={button} onClick={() => setProduct(button)}>{title(button)}</button>);

const Buttons = ({ setProduct }) => {
  const [buttonTexts, ] = useState(['shirts', 'jackets', 'accessories']);

  return (
    <div>
      <Button setProduct={setProduct} buttonTexts={buttonTexts} />
    </div>
  );
};

export default Buttons;