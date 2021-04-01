FROM node

WORKDIR "/usr/smarthotel-server"

COPY ./package.json ./

RUN npm install

COPY . .

CMD ["npm","run","start:de"]
