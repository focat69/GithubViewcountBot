<div align="center">
  <h1>GitHub Viewcount Bot 🚀</h1>
  <p>
    <strong>Automate the process of increasing the view count on your GitHub profile.</strong>
  </p>
  <p>
    <img src="https://img.shields.io/github/issues/focat69/GithubViewcountBot?style=for-the-badge" alt="Issues" />
    <img src="https://img.shields.io/github/stars/focat69/GithubViewcountBot?style=for-the-badge" alt="Stars" />
    <img src="https://img.shields.io/github/forks/focat69/GithubViewcountBot?style=for-the-badge" alt="Forks" />
  </p>
</div>

This tool was designed to *automate* the process of increasing the view count on your GitHub profile (assuming you use [antonkomarev/github-profile-views-counter](https://github.com/antonkomarev/github-profile-views-counter)). It uses proxies to make requests to the *GitHub Camo CDN*, simulating real users visiting your home page.  
(this is very buggy, please commit fixes im 2 lazy)

## Installation 🛠️

To install and set up the GitHub Viewcount Bot, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/focat69/GithubViewcountBot.git
    cd GithubViewcountBot
    ```

2. Install the required dependencies:
    ```sh
    npm install
    ```

## Usage 📈

To use the GitHub Viewcount Bot, follow these steps:

1. First, compile TypeScript:
    ```sh
    npx tsc
    ```

2. Now, run the program:
   ```sh
   # assuming you're in the root directory
   node ./src/index.js
   ```

3. Use the following commands within the bot interface:
    - `start <url> <workers> [proxiesFilePath] [timeout: 0]` : Start the view bot
    - `stop` : Stop the view bot

    Example:
    ```sh
    start https://camo.githubusercontent.com/5a9dfda22763b6bc0f39c95827e7b057ad31e72fef70bbf42fec123d71c42ac6/68747470733a2f2f6b6f6d617265762e636f6d2f67687076632f3f757365726e616d653d616e746f6e6b6f6d61726576266c6162656c3d50726f66696c65253230766965777326636f6c6f723d386361616565267374796c653d666f722d7468652d6261646765 10 proxies.txt 1
    ```

    This command will start the bot with 10 workers, using proxies from `proxies.txt`, and a timeout of 1 millisecond every request.

## Contributing 🤝

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## License 📜

This project is licensed under the MIT License. See the LICENSE file for details.
