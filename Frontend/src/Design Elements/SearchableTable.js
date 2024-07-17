import React, { useState } from 'react';

function SearchableTable({ columns, data, searchableKeys = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter((item) => {
    return searchableKeys.some((key) =>
      item[key].toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by..."
      />
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              {columns.map((column) => (
                <td key={column.key}>{item[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SearchableTable;
