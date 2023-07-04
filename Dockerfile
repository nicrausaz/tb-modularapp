FROM node:18-alpine

WORKDIR /app

COPY --chown=node:node . /app

RUN npm ci
RUN npm run build --workspaces

ENV NODE_ENV=production

RUN rm -rf node_modules
RUN npm install --omit=dev

VOLUME /var/modapp/database
VOLUME /var/modapp/modules

COPY --chown=node:node packages/server/.env.production /app/packages/server/.env

RUN mv packages/frontend/dist /app/packages/server/build/public
COPY --chown=node:node packages/server/src/database/model.sql /var/modapp/database/model.sql
COPY --chown=node:node packages/server/src/database/seed.sql /var/modapp/database/seed.sql

EXPOSE 3000

USER node

CMD ["npm", "run", "start", "--workspace", "packages/server"]