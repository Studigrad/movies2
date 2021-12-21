FROM node

WORKDIR /movieApp

COPY package.json /movieApp

RUN npm install 

COPY . .

EXPOSE 8050

CMD [ "node", "index.js" ]