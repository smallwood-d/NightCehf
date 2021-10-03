FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm build

RUN npm prune --production

EXPOSE 7811
CMD [ "npm", "run", "start" ]