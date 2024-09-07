import React from 'react';

export default function ResultsTable({ headers, results }) {
  if (results.length === 0) {
    return <div className="mt-4 text-gray-600">No data to display.</div>;
  }

  return (
    <div className="overflow-x-auto max-h-96 mt-4 shadow-md sm:rounded-lg">
      <table className="min-w-full table-fixed border-collapse border border-gray-300">
        <thead className="bg-blue-500">
          <tr>
            {headers.map((header, index) => (
              <th 
                key={index} 
                className="w-1/5 border border-gray-300 px-4 py-2 text-white">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((row, rowIndex) => (
            <tr key={rowIndex} className="even:bg-gray-100 odd:bg-white">
              {headers.map((header, cellIndex) => (
                <td 
                  key={cellIndex} 
                  className="w-1/5 border border-gray-300 px-4 py-2 text-gray-800">
                  {row[header] ? row[header] : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
