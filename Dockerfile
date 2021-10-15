FROM python:3.7

ENV PROJECT jlock
ENV PLATFORM docker
WORKDIR /opt/${PROJECT}

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -

RUN apt-get update && apt-get install -y \
                                        curl \
                                        nginx \
                                        make \
                                        rsync \
                                        nodejs \
                                        firefox-esr

COPY ./ /opt/${PROJECT}
COPY docker-config/bashrc /root/.bashrc

RUN npm install -g npm
RUN npm install

RUN make dev-install
RUN pip install jasmine

RUN ln -sf /opt/${PROJECT}/nginx/dev-site.conf /etc/nginx/sites-enabled/default
