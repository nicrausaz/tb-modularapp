FROM node:18-alpine

COPY . /app

WORKDIR /app
RUN npm ci
RUN npm run build --workspaces

RUN npm install --omit=dev

COPY packages/server/.env.production /app/packages/server/.env
RUN mv packages/frontend/dist /app/packages/server/build/public
COPY packages/server/public/logo.svg /app/packages/server/build/public/logo.svg
RUN mkdir -p /app/packages/server/build/public/users 
COPY packages/server/src/database/model.sql /var/modapp/database/model.sql
COPY packages/server/src/database/seed.sql /var/modapp/database/seed.sql
RUN mkdir -p /var/modapp/modules 

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "run", "start", "--workspace", "packages/server"]