# that-guy977/bots

## About

This repository is an archive, and is not meant to be used for other servers.

Console commands are run from the project root. `source` is a directory in the [`src/custom`](src/custom) directory.

## Usage

### Setting up the environment

Install [Git](https://git-scm.com/downloads) or [GitHub Desktop](https://desktop.github.com/) and fork and clone the repository.

Install a version of [Node.js](https://nodejs.org) above `16.9.0` and run `npm i` in console to install needed packages.

Create a `.env` file in the project root to store sensitive data.

### Setting up applications

Create applications in the [Discord Developer Portal](https://discord.com/developers), create a bot for each application, and copy each token to save in the `.env` file in the format `TOKEN_SOURCE`.

### Command Line

These actions can be executed via a command line.

#### Run

Run built project by using `node .`.

#### Lifecycle scripts

Can be run using `npm <script>`.

##### `start`

Runs `build`, then `node .`.

#### Custom scripts

Can be run using `npm run <script>`.

##### `debug`

Runs `compile`, then `node .`.

##### `build`

Runs `lint`, then `compile`.

##### `compile`

Compiles the `src` directory from TypeScript to JavaScript, outputting in `build`.

##### `clean`

Removes the `build` directory.

##### `lint`

Lints the `src` directory for style or formatting issues.


## Contact
You can contact me at `That_Guy977#5882` on Discord, or in the `Japanese 101` Discord server at [jp101](https://discord.gg/jp101).
