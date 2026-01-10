# blog-project
our first toy project - blog

## Env setup

### First time setup

python3 -m venv .venv
pip install -r requirements.txt


### For guix users:

#### Guix users need to run guix environment with guix shell before setting up python env:
guix shell -m manifest.scm

#### Set library directory for mysqlclient compilation
export LDFLAGS="-L$GUIX_ENVIRONMENT/lib"