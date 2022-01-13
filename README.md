# that-guy977/bots

## About

This repository is an archive, and is not meant to be used for other servers.

`SOURCE` is a placeholder for `JPHELP`, `DREAM`, or `OMEGA`. Console commands are run from [`src`](src).

## Usage

### Setting up the environment

Install a version of [Node.js](https://nodejs.org) above `16.6.0` and run `npm i` in console to install needed packages.

Create a `.env` file in the project root to store sensitive data.

Set the `ids` field in [`data.json`](src/shared/data.json) to match used ids. Update as necessary as applications are created.

### Setting up applications

Create applications in the [Discord Developer Portal](https://discord.com/developers), create a bot for each application, and copy each token to save in the `.env` file in the format `TOKEN_SOURCE`.

### Setting up the database

Setup a [MongoDB database](https://mongodb.com/) and save the name in the `.env` file in the format `MONGO_DATABASE`.

Add a user with the username `MONGO_SOURCE` and save the password in the `.env` file in the format `MONGO_SOURCE`.

Choose connect to the database and save the host in the `.env` file in the format `MONGO_HOST`.

Run `node SOURCE/populate` to populate the database.

### Setting application commands

Run `node SOURCE/deploy` to register slash commands.

### Running the bots

Run `node SOURCE` to run the bot.

## Contact
You can contact me at `That_Guy977#5882` on Discord, or in the `Japanese 101` Discord server at [jp101](https://discord.gg/jp101).
