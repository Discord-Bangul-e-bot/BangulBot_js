FROM node:16
WORKDIR /usr/src/app
COPY ./package.json ./package.json
# COPY ./nginx.conf ./etc/nginx/nginx.conf
# RUN apt-get update -y && apt-get install nginx -y 
# RUN service nginx restart
RUN npm install
RUN npm install --global tsc tsc-watch nodemon
EXPOSE 3000
# CMD npm start
