FROM node:18-alpine

WORKDIR /app

COPY JetsuenThinley_02250350_DSO101_A1\Backend\package.json

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node","server.js"]