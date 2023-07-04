FROM node:18-alpine
# RUN mkdir -p /app
WORKDIR /app

COPY --chown=node:node . /app
COPY --chown=node:node ./packages/server/.env.production /app/packages/server/.env

RUN npm install
# ENV NODE_ENV=production
RUN npm run build

VOLUME /var/modapp/database
VOLUME /var/modapp/modules

COPY --chown=node:node ./packages/frontend/dist /app/packages/server/build/public

# Copy database to volume
COPY --chown=node:node ./packages/server/src/database/model.sql /var/modapp/database/model.sql
COPY --chown=node:node ./packages/server/src/database/seed.sql /var/modapp/database/seed.sql


EXPOSE 3000

USER node

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace", "packages/server"]