FROM node:16
WORKDIR /usr/src/app
COPY ./package.json ./package.json
# COPY ./nginx.conf ./etc/nginx/nginx.conf
# RUN apt-get update -y && apt-get install nginx -y 
# RUN service nginx restart
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install git docker docker-compose -y
RUN npm install
RUN npm install --global tsc tsc-watch nodemon
EXPOSE 3000
# CMD npm start
