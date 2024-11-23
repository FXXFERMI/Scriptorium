# Dockerfile for Node.js
FROM node:14-slim

WORKDIR /code

CMD ["node", "program.js"]
