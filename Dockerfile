FROM node:8-alpine

ENV WORKDIR=/app
ENV NODE_ENV production

WORKDIR ${WORKDIR}

ENV NPM_CONFIG_REGISTRY="https://registry.npm.taobao.org"

COPY package.json .

RUN npm i --production

COPY . .

EXPOSE 9001

CMD ["npm", "start"]
