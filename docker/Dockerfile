FROM ubuntu:20.04

RUN  apt-get update \
  && apt-get install -y wget \
  && rm -rf /var/lib/apt/lists/*

RUN apt-get update

RUN apt-get install -y gnupg

RUN wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add -

RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list

RUN apt-get update

# RUN apt-get install libc6

# RUN apt-get install -y mongodb-org-shell mongodb-org-server mongodb-org-mongos mongodb-org-database

RUN apt-get install -y mongodb-org

RUN apt-get install -y npm

RUN npm install -g npm@latest

RUN npm install -g n

WORKDIR /dist

COPY . .

RUN n $(cat .nvmrc)

RUN n use $(cat .nvmrc)

RUN apt-get update

RUN yarn install --frozen-lockfile

ENV PORT=8080

EXPOSE 8080

CMD ["npm", "run", "dev"]
