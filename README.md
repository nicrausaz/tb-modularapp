Usefull monorepo commands:

- npm init --scope @yalk --workspace ./packages/<folder> -y

- npm run build --workspace ./packages/module-manager

- npm run build --workspaces

- npm install @yalk/module-manager --workspace ./packages/<folder>

- npm install packagename --workspace ./packages/ui

- npm run dev --workspace packages/server


Command to run on production (PI):

`docker build -t modapp .`

`docker run -p 3000:3000  modapp`