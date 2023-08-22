FROM node:12-alpine
ENV NODE_ENV=production
# Uncomment the following line to enable agent logging
# LABEL "network.forta.settings.agent-logs.enable"="true"
WORKDIR /app
COPY ./src ./src
COPY package*.json ./
COPY tsconfig.json ./
COPY ./dist ./dist
RUN npm ci --production
CMD [ "npm", "run", "start:prod" ]