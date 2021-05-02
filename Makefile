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
	sass --watch clock/sass:clock/css

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
