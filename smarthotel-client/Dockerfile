# # build stage
# FROM node as build-stage
# WORKDIR /smarthotel-client
# COPY package*.json ./
# RUN yarn install
# COPY . .
# RUN yarn run build

# # production stage
# FROM nginx as production-stage
# COPY --from=build-stage /smarthotel-client/.nuxt /usr/share/nginx/html
# EXPOSE 80
# # CMD ["nginx", "-g", "daemon off;"]

# FROM node

# WORKDIR "/usr/smarthotel-client"

# COPY ./package.json ./

# RUN yarn install

# COPY . .

# EXPOSE 5000

# # set app serving to permissive / assigned
# ENV NUXT_HOST=0.0.0.0

# # set app port
# ENV NUXT_PORT=5000

# CMD ["yarn","serve"]



# start the app
# CMD [ "npm", "start" ]

FROM node as builder

WORKDIR '/usr/smarthotel-client'

COPY ./package.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM nginx as production-stage

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
 
COPY --from=builder /usr/smarthotel-client/.nuxt/dist /usr/share/nginx/html

EXPOSE 5000

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0

# set app port
ENV NUXT_PORT=5000
# sudo npm install pm2 -g

# CMD ["nginx", "-g", "daemon off;"]

CMD ["yarn", "run", "start"] && ["nginx", "-g", "daemon off;"]
    
# FROM node

# WORKDIR "/usr/smarthotel-client"

# COPY ./package.json ./

# RUN yarn install

# COPY . .

# CMD ["yarn","serve"]


# FROM node as builder

# WORKDIR "/usr/smarthotel-client"

# COPY ./package.json ./

# RUN yarn install

# COPY . .

# RUN yarn run build

# FROM nginx

# EXPOSE 5000

# # COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# COPY /app/nginx.conf /etc/nginx/conf.d/default.conf

# COPY --from=builder /smarthotel-client/dist /usr/share/nginx/html





# # FROM node as builder

# # WORKDIR "/usr/smarthotel-client"

# # COPY ./package.json ./

# # RUN yarn install

# # COPY . .

# # RUN yarn build
# # # CMD ["npm","start"]

# # # /app/build <--- all the stuff

# # FROM nginx

# # EXPOSE 3000

# # COPY ./nginx/default.conf ./etc/nginx/conf.d/default.conf

# # # COPY --from=builder /usr/smarthotel-client/build /usr/share/nginx/html

# # COPY --from=builder /app/build /usr/share/nginx/html

