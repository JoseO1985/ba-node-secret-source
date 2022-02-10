# System Description

Bikes Anonymous is a small organization that certifies cyclists for riding on the road. They are internationally recognized with clients throughout the world who speak multiple languages. They have certified millions of riders. They run their infrastructure on Azure but use Linux on the back end. The back end consists of an API and an integrated Admin panel. The front end is web-based and interacts with the API.

BA has a nightly certification workflow that consists of

1) Receiving a CSV from a partner certification center 
2) Converting each row of the CSV into a rider’s licenses in PDF format
3) Emailing the PDF to the license holder using the email field in the CSV
4) Finally, when the whole file has been processed, the system notifies by email both the partner certification center and BA that all certifications in the CSV have been processed.

Given the amount of data processed on a daily basis, it is imperative that processing the CSV be done via a scheduled task and not as part of the upload process.

Given the relative sensitivity of the data, only authenticated users can upload a file for processing (for this sample project, please only add authentication if you have time, this is low priority for this sample project).

Using Node, create an API and necessary code that fulfils the following user stories.

## User Stories
1) I, as an authenticated user, can upload a CSV so that BA can process the data and mail the cyclist licenses. (Note: for this story, it is not necessary to create a front end, only an endpoint and associated backend code)
2) I, as a certified cyclist, can print a PDF of my license so that I can start riding immediately.
3) I, as the owner of BA, can read an email containing a summary of the nightly activity so that I can gauge how well my business is doing.

### Acceptance Criteria
For this exercise, we ask that the developer elaborate the acceptance criteria they deem necessary to verify that the user stories above have been fulfilled.

# Bikes Anonymous (NodeJS)

This is the starter project for the Secret Source Technology SL Bikes Anonymous (NodeJS) sample project.

This project in its current state includes:

- Express (mostly unconfigured but may have one or two routes - it's up to you to decide if they are worthy of keeping)
- Authentication scaffolding (mostly configured, we don't want you to have to bother with something so standard)
- Bugs (either typos or just plain incorrect usage of commands)
- Incorrect packages (we'll leave it up to you to figure out which ones should stay, which should go, and which should still be added)
- One or more tests of questionable value, and possibly comlpetely broken

The project may optionally include:

- WET code
- Code smells
- Unused code
- Other, myriad bad practices (which you are welcome to fix as part of this project - is that jpg really 8MB?)

And finally, we're providing this repo in JavaScript (because it has the widest audience) but if you really want to, you can convert it to TypeScript (or just do your part in TypeScript).

## Internal Dev Plan for this Project

1) install required node packages (express and ??),
2) configure authentication, including seeds,
3) write a few tests for desired functionality??

## Getting started

To run the project on your local machine there are two options:

### 1. Run the project with node installed locally
- [Install](https://nodejs.org/en/download/) a recent version of nodejs. 
  ```
  // On macOS can be installed with brew
  $ brew update
  $ brew install node
  ```
- [Install](https://yarnpkg.com/getting-started/install) `yarn` package manager. 
  ```
  $ npm install -g yarn
  ```
- Install the project dependencies with `yarn`.
  ```
  $ yarn install
  ```
- Copy `.env.example` file to `.env` so the app can load the environment variables needed.
  ```
  $ cp .env.example .env
  ```
- Start the app by running `yarn dev` command. This will start the app and make it listen for requests on the port you specified on your `.env` file.

### 2. Run the project with docker
- [Install](https://docs.docker.com/get-docker/) the docker desktop client on your machine.
- Copy `.env.example` file to `.env` so the app can load the environment variables needed.
  ```
  $ cp .env.example .env
  ```
  Beware that if you change the port of the application in the `.env` file you will need to update the `docker-compose.yml` file `ports` configuration
  matching the new port of your application.
- Build the project's container
  ```
  $ docker-compose up --build
  ```
- Run the app with docker compose (if it's already been built)
  ```
  $ docker-compose start
  or
  $ docker-compose up -d
  ```
- Now the app should be accessible from the port you specified. By default `http://localhost:8000`
- To stop the app's container
  ```
  $ docker-compose stop
  ```
