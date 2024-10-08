FROM golang:1.17-alpine

LABEL maintainer="jyrihkl" \
        version="1.0" \
        description="Service 2 using golang"

RUN apk add --no-cache procps

WORKDIR /app
COPY . .

RUN go mod init service2 && go mod tidy
RUN go build -o service2 .

EXPOSE 5001

CMD ["./service2"]
