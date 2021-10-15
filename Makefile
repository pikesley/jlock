PROJECT = $(shell basename $$(pwd))
ID = pikesley/${PROJECT}
PIHOST = hyperpixel.local
PIHOST = hp.local

PLATFORM ?= laptop

# default

all: docker-only format lint test clean

# laptop targets

build: laptop-only
	docker build \
		--tag ${ID} .

run: laptop-only
	docker run \
		--name ${PROJECT} \
		--volume $(shell pwd):/opt/${PROJECT} \
		--volume ${HOME}/.ssh:/root/.ssh \
		--interactive \
		--tty \
		--rm \
		--publish 8888:8888 \
		--publish 5000:5000 \
		--publish 8000:80 \
		${ID} \
		bash

exec: laptop-only
	docker exec \
		--interactive \
		--tty \
		${PROJECT} \
		bash

# docker dev targets

sass: docker-only
	sass --watch sass:static/css

push-code: docker-only
	rsync --archive \
		  --verbose \
		  --delete \
			--exclude node_modules \
		  . \
		  pi@${PIHOST}:jlock

test: docker-only jasmine-ci

lint: docker-only
	python -m pylama

clean: docker-only
	@find . -name __pycache__ -exec rm -fr {} \;
	@rm -fr reports
	@rm -f geckodriver.log

jasmine: docker-only
	jasmine server --host 0.0.0.0

jasmine-ci: docker-only
	@MOZ_HEADLESS=true jasmine ci -b firefox | grep -v "Mozilla/5.0" | grep -v Warning

black:
	black .

isort:
	isort .

format: black isort

# pi targets

setup: pi-only set-python apt-installs install virtualhost system-install configure-shell
	sudo reboot

configure-shell: pi-only set-autologin disable-power-warning
	cp shell-config/bash_profile /home/pi/.bash_profile
	cp shell-config/xinitrc /home/pi/.xinitrc

set-autologin: pi-only
	sudo raspi-config nonint do_boot_behaviour B2

disable-power-warning: pi-only
	echo "avoid_warnings=2" | sudo tee -a /boot/config.txt

set-python: pi-only
	sudo update-alternatives --install /usr/local/bin/python python /usr/bin/python2 1
	sudo update-alternatives --install /usr/local/bin/python python /usr/bin/python3 2

apt-installs: pi-only
	sudo apt-get update
	sudo apt-get install \
		--no-install-recommends \
		--yes \
		xserver-xorg-video-all \
		xserver-xorg-input-all \
		xserver-xorg-core \
		xinit x11-xserver-utils \
		chromium-browser \
		unclutter \
		nginx \
		xdotool \
		python3-pip

prepare-logs: pi-only
	sudo mkdir -p /var/log/controller/
	sudo chown pi /var/log/controller/

system-install: systemd restart-services

systemd: pi-only prepare-logs
	sudo systemctl enable -f /home/pi/${PROJECT}/etc/systemd/controller.service

virtualhost: pi-only
	sudo ln -sf /home/pi/jlock/nginx/site.conf /etc/nginx/sites-enabled/default

restart-services: pi-only
	sudo service controller restart

###

install:
	python -m pip install -r requirements.txt

dev-install:
	python -m pip install -r requirements-dev.txt

###

docker-only:
	@ if [ "${PLATFORM}" != "docker" ] ;\
		then \
			echo "This target can only be run inside the container" ;\
			exit 1 ;\
		fi

laptop-only:
	@ if [ "${PLATFORM}" != "laptop" ] ;\
		then \
			echo "This target can only be run on the laptop" ;\
			exit 1 ;\
		fi

pi-only:
	@if ! [ "$(shell uname -a | grep 'armv.* GNU/Linux')" ] ;\
	then \
		echo "This target can only be run on the Pi" ;\
		exit 1 ;\
	fi
