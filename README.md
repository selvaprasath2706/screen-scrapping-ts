# Screen Scrapping using Typescript

***Installation Steps for node application***

- Clone the repository
- Create a .env file and configure the file with below values
  - API_ENDPOINT="https://localhost:9001/v1/mail-server/send/bulk-mail"
  - BASE_URI="https://dev.to"
  - SELECTOR=".crayons-story__title a"
  - TO_MAILS="sampleEmail1@gmail.com,sampleEmail2@gmail.com"
  - PORT=3001
- run command npm install
- to start the application run the command npm run dev
- to run test: npm run test
  - before running npm test run the command on terminal to avoid ssl certificate related errors export NODE TLS_REJECT_UNAUTHORIZED=0

***Installation Steps for backend docker***

- Clone and run the container in docker [Link to docker](https://hub.docker.com/r/giribabu2000/mail-server)
- Start the container
