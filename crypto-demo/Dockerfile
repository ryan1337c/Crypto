# Uses node version 22 as our base image
FROM node:22

# Goes to the app directory
WORKDIR /crypto-demo

# Copy package.json and package-lock.json 
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of our app into the container
COPY . .

# Set port environment variable
ENV PORT=3000
# Expose the port so our computer can access
EXPOSE 3000

# Run the app on container
CMD ["npm", "start"]