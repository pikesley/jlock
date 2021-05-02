FROM python:3.7

ENV PROJECT qlock
ENV PLATFORM docker
ENV SASS_VERSION 1.32.10

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -

RUN apt-get update && apt-get install -y \
                                        curl \
                                        nginx \
                                        make \
                                        rsync \
                                        nodejs \
                                        firefox-esr

RUN npm install -g npm
RUN npm install

RUN cd /tmp && \
    curl \
        --silent \
        --location \
        --request GET \
        https://github.com/sass/dart-sass/releases/download/${SASS_VERSION}/dart-sass-${SASS_VERSION}-linux-x64.tar.gz \
        --output sass.tgz && \
        tar xzvf sass.tgz && \
        mv dart-sass/sass /usr/local/bin/

RUN pip install --upgrade pip jasmine

RUN ln -sf /opt/${PROJECT}/nginx/dev-site.conf /etc/nginx/sites-enabled/default

COPY docker-config/bashrc /root/.bashrc

WORKDIR /opt/${PROJECT}
