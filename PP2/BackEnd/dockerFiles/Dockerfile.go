FROM golang:1.18-alpine

WORKDIR /code

CMD ["sh", "-c", "go run program.go"]
