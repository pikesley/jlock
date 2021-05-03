PROJECT = $(shell basename $$(pwd))
ID = pikesley/${PROJECT}
PIHOST = 192.168.68.109

PLATFORM ?= laptop

all: test

build: laptop-only
	docker build \
		--tag ${ID} .

run: laptop-only
	docker-compose exec ${PROJECT} bash

serve: docker-only
	service nginx start

sass: docker-only
	sass --watch clock/sass:clock/css static:static

push-code: docker-only
	rsync --archive \
		  --verbose \
		  --delete \
			--exclude node_modules \
		  /opt/${PROJECT} \
		  pi@${PIHOST}:

test: jasmine-ci nightwatch-tests

jasmine: docker-only
	jasmine server --host 0.0.0.0

jasmine-ci: docker-only
	@MOZ_HEADLESS=true jasmine ci -b firefox | grep -v "Mozilla/5.0" | grep -v Warning

nightwatch-tests: docker-only
	@nightwatch

black:
	black .

isort:
	isort .

format: black isort

###

set-python: pi-only
	sudo update-alternatives --install /usr/local/bin/python python /usr/bin/python2 1
	sudo update-alternatives --install /usr/local/bin/python python /usr/bin/python3 2

apt-installs: pi-only
	sudo apt-get update
	sudo apt-get install -y python3-pip

prepare-logs: pi-only
	sudo mkdir -p /var/log/control-server/
	sudo chown pi /var/log/control-server/

system-install: systemd restart-services

systemd: pi-only prepare-logs
	sudo systemctl enable -f /home/pi/${PROJECT}/etc/systemd/control-server.service

restart-services:
	sudo service control-server restart

###

install:
	python -m pip install -r requirements.txt

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
