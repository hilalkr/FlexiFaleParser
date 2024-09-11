import React from 'react';

const ResultsTable = ({ headers, results }) => {
  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="px-4 py-2">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {results.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header, colIndex) => (
              <td key={colIndex} className="border px-4 py-2">{row[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;
