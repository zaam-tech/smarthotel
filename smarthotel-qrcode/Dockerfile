FROM golang

WORKDIR "/usr/smarthotel-qrcode"

COPY go.mod ./

COPY go.sum ./

RUN go mod download

COPY . .

CMD ["go","run","."]