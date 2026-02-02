FROM nginx:stable-alpine3.23

RUN apk add --no-cache curl ca-certificates 

COPY ./nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]