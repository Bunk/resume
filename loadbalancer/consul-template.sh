#!/bin/sh

exec consul-template \
     -log-level=info \
     -consul=consul:8500 \
     -template "/etc/consul-templates/nginx.conf:/etc/nginx/conf.d/app.conf:sv hup nginx"
