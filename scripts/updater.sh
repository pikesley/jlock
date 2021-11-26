CURRENT_HEAD=$(git rev-parse HEAD)

git pull -f

NEW_HEAD=$(git rev-parse HEAD)

if [ "${NEW_HEAD}" != "${CURRENT_HEAD}" ]
then
	./configure
	make
fi
