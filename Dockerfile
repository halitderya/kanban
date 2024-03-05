FROM node:18-alpine3.18

# Create app directory

WORKDIR /usr/src/app

COPY . .

RUN npm install 
RUN npm run build
CMD ["npm", "start"]