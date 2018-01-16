FROM node:carbon

# Set our workdir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install and cache app dependencies
COPY package*.json /usr/src/app/
RUN npm install

# Add project files
COPY . /usr/src/app

# start app
CMD [ "npm", "start" ]
