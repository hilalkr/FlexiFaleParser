const parseJSON = async (buffer) => {
  try {
    const jsonString = buffer.toString('utf-8');  
    const jsonData = JSON.parse(jsonString);  
  } catch (error) {
    throw new Error("Error parsing JSON file: " + error.message);
  }
};

module.exports = { parseJSON };
