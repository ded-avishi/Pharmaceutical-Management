import React, { useState } from 'react';

const Table2 = ({ data, columns, sortableColumns = [], key }) => {
  const [sortedData, setSortedData] = useState(data);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const sortTable = (field) => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);

    setSortedData((prevData) =>
    sortableColumns.includes(field)
    ? prevData.slice().sort((a, b) => {
        if (a[field] < b[field]) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (a[field] > b[field]) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      }) : prevData
    );
    setSortField(field);
  };

  return (
    <div>
    <table key={key}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} onClick={() => sortTable(column.key)}>
              {column.label}
              {sortField === column.key && (
                <span>{sortOrder === 'asc' ? '▾' : '▴'}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (
              <td key={column.key}>{row[column.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default Table2;
