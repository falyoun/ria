
ARG workdir=/Users/falyoun/dev/ite/ria

FROM node:12.19.0-alpine3.9 AS riaDevelopmentEnv
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR ${workdir}
COPY package*.json ./
# RUN npm install glob rimraf
RUN npm install
COPY . .
RUN npm run build

FROM node:12.19.0-alpine3.9 AS riaProductionEnv
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR ${workdir}
COPY package*.json ./
RUN npm install --only=production
COPY . .
COPY --from=riaDevelopmentEnv ${workdir}/dist ./dist
CMD ["node", "dist/main"]
