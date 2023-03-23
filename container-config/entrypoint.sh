#!/bin/bash

function __show_help() {
    echo "Container entrypoint commands:"
    echo "  help - show this help"
    echo "  test - run the tests"
    echo ""
    echo "Any other command will be executed within the container."
}

service redis-server start
service nginx start

case ${1} in
  help )
    __show_help
    ;;

  test )
    export PATH=/opt/jlock/node_modules/.bin:${PATH}
    cd /opt/jlock
    make --makefile make/Makefile.podman
    ;;

  * )
    exec "$@"
    ;;
esac
