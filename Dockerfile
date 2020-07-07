# Docker Image which is used as foundation to create
# a custom Docker Image with this Dockerfile
FROM node:14.4.0

# A directory within the virtualized Docker environment
# Becomes more relevant when using Docker Compose later
WORKDIR /usr/src/app

# Copies package.json and package-lock.json to Docker environment
COPY package*.json ./
COPY yarn.lock ./

# Installs all node packages
RUN yarn

RUN yarn build
#
#RUN cd ..

# Copies everything over to Docker environment
COPY . ./

# Uses port which is used by the actual application
EXPOSE 8080

# Finally runs the application
CMD [ "node", "index.js" ]
