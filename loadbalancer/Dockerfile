FROM nginx:1.7
MAINTAINER JD Courtoy <jd.courtoy@gmail.com>

RUN DEBIAN_FRONTEND=noninteractive \
    apt-get update -qq && \
    apt-get -y install curl runit unzip && \
    rm -rf /var/lib/apt/lists/*

# Install Consul-Template
ENV CT_VERSION 0.12.2
ENV CT_URL https://releases.hashicorp.com/consul-template/${CT_VERSION}/consul-template_${CT_VERSION}_linux_amd64.zip
RUN curl -L $CT_URL -o /tmp/consul.zip && unzip -uo /tmp/consul.zip -d /usr/local/bin

# Setup Nginx
RUN rm -v /etc/nginx/conf.d/*
COPY nginx.conf /etc/consul-templates/nginx.conf

# Add Nginx and Consule-Template services to run via runit
COPY nginx.sh /etc/service/nginx/run
COPY consul-template.sh /etc/service/consul-template/run

CMD ["/usr/bin/runsvdir", "/etc/service"]
