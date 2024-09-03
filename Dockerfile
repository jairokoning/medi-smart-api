FROM node:21-slim

RUN apt update && apt install -y openssl procps

WORKDIR /home/node/app

RUN chown -R node:node /home/node/app

COPY --chown=node:node . .

USER node
#CMD tail -f /dev/null