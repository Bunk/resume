FROM node:5.1

# Install Pandoc
RUN apt-get update -y
RUN apt-get install -y pandoc context

# Install Nodemon for local dev
RUN npm install -g nodemon

RUN mkdir /usr/src
WORKDIR /usr/src

ADD nodemon.json nodemon.json
ADD package.json package.json
RUN npm install
