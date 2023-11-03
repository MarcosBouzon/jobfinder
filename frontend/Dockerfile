FROM node as builder

LABEL mantainer="MarcosBouzon1@gmail.com"

ARG REACT_APP_STAGE
ENV REACT_APP_STAGE $REACT_APP_STAGE

# Copy files
COPY . /frontend/

WORKDIR /frontend

# Install packages
RUN npm install -y
RUN npm run build

FROM nginx

COPY  --from=builder /frontend/dist /usr/share/nginx/html
# COPY ./dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 9090
