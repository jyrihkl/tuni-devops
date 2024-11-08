FROM node:23

LABEL maintainer="jyrihkl" \
        version="1.1" \
        description="Service 1 using nodejs"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8199

CMD ["node", "service1.js"]

