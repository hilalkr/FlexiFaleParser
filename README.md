
# FlexiFileParser

**FlexiFileParser** is a versatile tool designed for parsing and filtering various file formats. Whether it's table data or other formats, FlexiFileParser offers an adaptable solution for handling and displaying data efficiently. The tool allows users to upload files, parse them, and apply keyword-based filtering on the data.

## Features

- **File Upload**: Upload files in various formats (CSV, JSON, etc.).
- **Data Parsing**: Efficiently parse and display data from the uploaded files.
- **Keyword Filtering**: Filter data based on user-provided keywords.
- **Scrollable View**: View the first 10 rows of the parsed data, with the ability to scroll through the rest.
- **File Information**: Display detailed file information in a card-style modal.
- **Error Handling**: User-friendly error messages and alerts for failed parsing attempts or empty data results.

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
├── components
│   ├── FileUpload.js          # Component for file upload
│   ├── ResultsTable.js        # Component for rendering results table
├── pages
│   ├── index.js               # Main page with upload and parse functionality
├── utils
│   ├── parseJSON.js           # Utility to parse JSON files
│   ├── parseXLSX.js           # Utility to parse XLSX files
├── server.js                  # Express server to handle file uploads and parsing
└── README.md                  # Project README file
```

## Future Enhancements

- Add support for additional file formats (e.g., XML).
- Implement user authentication.
- Improve UI with more styling and animations.

## License

This project is licensed under the MIT License.
