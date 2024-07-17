import React, { useState, useEffect } from 'react';

const ItemCount2 = ({ initialCount = 0, finalCount = 0, onClick, id , Price}) => {
    const [count, setCount] = useState(initialCount);
    console.log(id)

    const increment = () => {
        setCount(prevCount => Math.min(prevCount + 1, finalCount));
        if (onClick) {
            onClick(Math.min(count + 1, finalCount));
        }
    };

    const decrement = () => {
        setCount(prevCount => Math.max(prevCount - 1, 0));
        if (onClick) {
            onClick(Math.max(count - 1, 0));
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style = {{margin : 10}}>{Price * count}</span>
    </div>
    );
};

export default ItemCount2;