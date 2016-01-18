FROM node:4.2.4
MAINTAINER JD Courtoy

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install
COPY . /usr/src/app

EXPOSE 3000

CMD [ "npm", "start" ]
