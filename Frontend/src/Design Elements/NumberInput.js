import React, { useState } from 'react';

function NumberInput({initial, onClick}) {
  const [inputValue, setInputValue] = useState(initial);

  const handleChange = (event) => {
    let newValue = event.target.value;

    if (newValue === '') {
        setInputValue('');
        onClick(initial);
        return;
      }

    newValue = parseInt(newValue, 10);
    if (!isNaN(newValue) && Number.isInteger(newValue)) {
      setInputValue(newValue);
      onClick(newValue);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
}

export default NumberInput;
