FROM node:21-alpine AS node-builder

WORKDIR /backend

RUN apk add git

COPY package*.json .
RUN yarn

ADD tsconfig.json .
COPY . .
RUN yarn build

FROM registry.heroiclabs.com/heroiclabs/nakama:3.22.0

COPY --from=node-builder /backend/build/*.js /nakama/data/modules/build/
COPY local.yml /nakama/data/
