FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json jest.config.js ./
RUN npm install

COPY tests ./tests

CMD ["npm", "test"]
