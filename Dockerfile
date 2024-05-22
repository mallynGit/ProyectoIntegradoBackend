FROM node:20-alpine
RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm config set proxy http://172.31.43.173:80
COPY . .
EXPOSE 3001
CMD [ "node", "src/index.js" ]

# docker build -t maruizlosada/backend-tfg:v1 .
# docker push maruizlosada/backend-tfg:v1
