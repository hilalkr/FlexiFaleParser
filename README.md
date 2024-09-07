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
- **npm**: Comes bundled with Node.js, but verify it with `npm -v` after installing Node.js.
- **React**: This project is built using React. You can install React with npm if it’s not already set up:
  ```bash
  npx create-react-app flexifileparser ´´´

### Project Dependencies
The project uses the following key dependencies:

- **next**: A React framework for server-side rendering and static site generation.
- **react and react-dom**: Core React libraries for building the UI.
- **tailwindcss**: Utility-first CSS framework for creating fast and responsive designs.
- **autoprefixer**: Adds vendor prefixes for better browser support in CSS.
- **postcss**: For transforming styles with JavaScript plugins, required for Tailwind CSS.
- **multer**: Middleware for handling file uploads.
- **csv-parser**: Parses CSV files for processing.
- **xml2js**: Converts XML to JavaScript objects for easier manipulation.
- **next-connect**: Middleware and routing handler for Next.js API routes.
- **express**: Web framework for handling API routes.
- **cors**: Middleware for enabling Cross-Origin Resource Sharing (CORS) in Express.
