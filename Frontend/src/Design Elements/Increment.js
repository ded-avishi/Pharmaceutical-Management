import React, { useState, useEffect } from 'react';

const ItemCount = ({ initialCount = 0, finalCount = 0, onClick, id }) => {
    const [count, setCount] = useState(initialCount);

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
        <div className="item-count">
            <button onClick={decrement}>-</button>
            <span>   {count}   </span>
            <button onClick={increment}>+</button>
        </div>
    );
};

export default ItemCount;