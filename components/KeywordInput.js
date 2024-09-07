import React from 'react';

const KeywordInput = ({ onKeywordChange }) => {
  return (
    <div className="keyword-input">
      <input 
        type="text" 
        placeholder="Enter keyword or regex" 
        onChange={(e) => onKeywordChange(e.target.value)} 
        className="border p-2 w-full"
      />
    </div>
  );
};

export default KeywordInput;
