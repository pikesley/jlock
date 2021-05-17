FROM python:3.7

ENV PROJECT jlock
ENV PLATFORM docker
ENV SASS_VERSION 1.32.10
WORKDIR /opt/${PROJECT}

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -

RUN apt-get update && apt-get install -y \
                                        curl \
                                        nginx \
                                        make \
                                        rsync \
                                        nodejs \
                                        firefox-esr

RUN cd /tmp && \
    curl \
        --silent \
        --location \
        --request GET \
        https://github.com/sass/dart-sass/releases/download/${SASS_VERSION}/dart-sass-${SASS_VERSION}-linux-x64.tar.gz \
        --output sass.tgz && \
        tar xzvf sass.tgz && \
        mv dart-sass/sass /usr/local/bin/

COPY ./ /opt/${PROJECT}
COPY docker-config/bashrc /root/.bashrc

RUN npm install -g npm
RUN npm install

RUN pip install --upgrade pip jasmine ipdb black isort pylama pylint
RUN make install

RUN ln -sf /opt/${PROJECT}/nginx/dev-site.conf /etc/nginx/sites-enabled/default

