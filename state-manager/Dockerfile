FROM node:22-alpine
WORKDIR /app
COPY state-manager.js .
RUN npm install express body-parser
CMD ["node", "state-manager.js"]
