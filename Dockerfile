FROM node:latest

RUN apt-get update -y
RUN apt-get install imagemagick  libjansson4  -y

ADD . /DtubeSnapProcessor
WORKDIR /DtubeSnapProcessor
RUN npm install

EXPOSE 5000

ENV CORSVAR '*'
ENV IPFSIP  "127.0.0.1"
ENV IPFSPORT  "5001"
ENV IPFSPROTOCOL "http"

CMD ["npm", "start"]
