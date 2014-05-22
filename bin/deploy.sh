# upload a single dir

DISTDIR="dist"

set -x

function upload {
	echo "---- uploading to $1 ----"
	cd $1
	rsync -avz --progress . \
		klabdev@floyd.dreamhost.com:/home/klabdev/spellchain.pikkle.com/dev/famcards
	cd -
}

# grunt build

upload $DISTDIR
open http://spellchain.pikkle.com/dev/famcards