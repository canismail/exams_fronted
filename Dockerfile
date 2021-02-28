FROM node:12.4.0-alpine as build

RUN apk add git

WORKDIR /app

COPY . .

#RUN npm install --silent

#RUN npm install react-scripts@3.4.3 -g --silent

RUN npm install --no-optional

RUN yarn add axios 

RUN npm run build

CMD ["npm", "start"]
