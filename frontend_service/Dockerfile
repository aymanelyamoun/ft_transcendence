# FROM node:20

# RUN apt update

# # COPY frontend/package*.json .

# # RUN npm install

# WORKDIR /frontend
# RUN chmod +x ./script.sh

# ENTRYPOINT ./script.sh

# FROM node:alpine
#  RUN apt update
# WORKDIR /trans

# COPY frontend/package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 3000
# RUN chmod +x ./script.sh
# CMD ["bash", "./script.sh"]

FROM node:20.6.1

RUN apt update

COPY frontend/package*.json .

WORKDIR /frontend

RUN npm install

ENTRYPOINT npm run build && npm run start
# COPY frontend/package*.json .
# COPY frontend frontend

# EXPOSE 3000

# Make sure script.sh is in the correct directory before running chmod

# CMD ["tail", "-f", "/dev/null"]

