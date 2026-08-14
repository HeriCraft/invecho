FROM node:22-slim
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# The rest of the files are expected to be mounted via volumes for local dev,
# but we copy them anyway so the image can run standalone if needed.
COPY . .
RUN npx prisma generate

EXPOSE 3000

# Start NestJS in watch mode
CMD ["npm", "run", "start:dev"]
