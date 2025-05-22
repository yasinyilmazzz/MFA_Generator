# TOTP MFA Code Generator

This project is a simple MFA (Multi-Factor Authentication) code generator that allows users to generate TOTP (Time-Based One-Time Password) codes.

## Live Demo

This project is live and can be accessed at [https://mfagenerator.netlify.app/](https://mfagenerator.netlify.app/).

## Setup

1.  **Clone the repository:**
    ```shell
    git clone https://github.com/yasinyilmazzz/MFA_Generator.git>
    cd TOTP
    ```

2.  **Install dependencies:**
    ```shell
    npm install
    ```

## Usage

1.  **Run the server:**
    ```shell
    npm start
    ```

2.  **Open the application in your browser** at `http://localhost:3000`.

3.  **Enter your secret key** in the input field and click the "Generate" button to generate the TOTP code.

## Features

*   Generates TOTP codes based on a secret key.
*   Allows saving and importing/exporting secret keys.
*   Provides a countdown timer to indicate when the code will refresh.

## Technologies Used

*   Node.js
*   Express
*   otplib
*   HTML
*   CSS
*   JavaScript

## License

This project is licensed under the MIT License.