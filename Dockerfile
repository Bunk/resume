FROM node:6-alpine
MAINTAINER JD Courtoy <jd.courtoy@gmail.com>

ENV APP_PATH /app
WORKDIR $APP_PATH

RUN npm i -g http-server

COPY . .

EXPOSE 8080

ENTRYPOINT [ "http-server" ]
CMD ["--help"]
