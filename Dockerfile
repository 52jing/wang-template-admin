FROM nginx:1.25

RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY dist/spa /usr/share/nginx/html
