FROM node:18-alpine
# RUN mkdir -p /app
WORKDIR /app

# build before pushing to docker

COPY . /app
COPY ./packages/server/.env.production /app/packages/server/.env

RUN npm install
RUN npm run build

VOLUME /var/modapp/database
VOLUME /var/modapp/modules

COPY ./packages/server/build /app/packages/server
COPY ./packages/frontend/dist /app/packages/server/build/public

# Copy database to volume
COPY ./packages/server/src/database/model.sql /var/modapp/database/model.sql
COPY ./packages/server/src/database/seed.sql /var/modapp/database/seed.sql

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace", "packages/server"]