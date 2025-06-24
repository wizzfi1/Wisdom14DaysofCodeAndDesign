FROM node:16

WORKDIR /workspace/Wisdom14DaysofCodeAndDesign

# Install netcat for health checks and postgres client
RUN apt-get update && apt-get install -y netcat postgresql-client

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

EXPOSE 3001

CMD ["npm", "start"]docker build -t wisdom14daysofcode .