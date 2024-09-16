
# FlexiFileParser

**FlexiFileParser** is a versatile tool designed for parsing and filtering various file formats. Whether it's table data or other formats, FlexiFileParser offers an adaptable solution for handling and displaying data efficiently. The tool allows users to upload files, parse them, and apply keyword-based filtering on the data.

## Features

- **File Upload**: Upload files in various formats (CSV, JSON, etc.).
- **Data Parsing**: Efficiently parse and display data from the uploaded files.
- **Keyword Filtering**: Filter data based on user-provided keywords.
- **Scrollable View**: View the first 10 rows of the parsed data, with the ability to scroll through the rest.
- **File Information**: Display detailed file information in a card-style modal.
- **Error Handling**: User-friendly error messages and alerts for failed parsing attempts or empty data results.
## Why were these technologies used?
- I chose **Node.js** and **Express** for the backend due to their asynchronous, non-blocking nature, which is ideal for handling I/O operations such as file uploads and parsing. Multer was selected as the file upload middleware for its simplicity and efficiency. 

- React and Next.js on the frontend provide a reactive interface, enabling fast updates when new data is parsed or when users interact with the table. Tailwind CSS was used to ensure a clean, modern design without the overhead of custom styling. The use of streaming libraries like csv-parser ensures that even large CSV files are handled efficiently.
## Project Requirements

To run this project, ensure that the following dependencies and tools are installed:

### Prerequisites

- **Node.js**: Install the latest version from [Node.js official site](https://nodejs.org/).
- **npm**: Comes bundled with Node.js, but verify it with:

  ```bash
  npm -v
  ```

- **React**: This project is built using React. You can install React with npm if it’s not already set up:

  ```bash
  npx create-react-app flexifileparser
  ```

### Project Dependencies

To install the project dependencies, run the following command:

```bash
npm install
```


### Running the Application

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the Next.js development server**:

   ```bash
   npm run dev
   ```

4. **Run the backend server**:

   Open a second terminal and run the following command:

   ```bash
   node server.js
   ```

5. **Access the application**:

   Open your browser and navigate to `http://localhost:3000`.

## Folder Structure

```plaintext
.
├── .next
├── components
│   ├── FileUpload.js
│   ├── KeywordInput.js
│   ├── ResultsTable.js
├── pages
│   ├── api
│   │   ├── parse.js
│   ├── _app.js
│   ├── index.js
├── styles
│   └── global.css
├── utils
│   ├── parseCSV.js
│   ├── parseJSON.js
│   ├── parseXLSX.js
│   ├── parseXML.js
├── .gitignore
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── server.js
├── tailwind.config.js
                 
```



## License

This project is licensed under the MIT License.
