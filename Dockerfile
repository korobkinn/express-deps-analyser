FROM node:lts-alpine3.17
WORKDIR /app
ENV PORT 5072
EXPOSE ${PORT}
COPY ./package.json /app/package.json
RUN npm install
COPY . /app
ENTRYPOINT ["npm", "start"]