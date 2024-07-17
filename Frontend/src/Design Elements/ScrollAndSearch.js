import React, { useState, useMemo } from 'react';

const Table = ({ data, columns, searchableColumns = columns, key,sortableColumns = columns }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredData = useMemo(() => {
    let filtered = data;
    if (searchTerm) {
      filtered = filtered.filter((row) =>
        searchableColumns.some((col) =>
          String(row[col]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return filtered.sort((a, b) => {
      if (!sortableColumns.includes(sortField)) {
        return 0;
      }

      const valueA = Number(a[sortField] || 0);
      const valueB = Number(b[sortField] || 0);

      if (valueA < valueB) {
        return sortOrder === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, searchTerm, sortField, sortOrder, searchableColumns, sortableColumns]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortClick = (column) => {
    const newSortField = column.accessor;
    const newSortOrder = sortField === newSortField ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';

    setSortField(newSortField);
    setSortOrder(newSortOrder);
  };

  return (
    <div className="table-container">
      <div className="search-controls">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <table key = {key} className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.accessor}>
                <div
                  className={`table-header ${
                    sortField === column.accessor && `sorted-${sortOrder}`
                  }`}
                  onClick={() => handleSortClick(column)}
                >
                  <span>{column.label}</span>
                  {sortField === column.accessor && (
                    <span className="sort-indicator">{sortOrder === 'asc' ? '▾' : '▴'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.accessor}>{row[column.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
