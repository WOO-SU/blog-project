# blog-project
our first toy project - blog

## We are now migrating to docker containers
### Please follow the instruction below.
```bash
docker compose up -d
docker ps # Check for health
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

### After that, access site by:
[http://localhost:8000/admin/](http://localhost:8000/admin/)

## Env setup
### For guix users:

#### Guix users need to run guix environment with guix shell before setting up python env:
```bash
guix shell -m manifest.scm
# Set library directory for mysqlclient compilation
# GUIX_ENVIRONMENT flag is set when you enter guix shell.
# This part is required because mysqlclient tries to load some libraries required for compilation
export LDFLAGS="-L$GUIX_ENVIRONMENT/lib" 
```

### First time setup

#### Linux/MacOS 
```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

#### PowerShell
```powershell
python3 -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Always enable venv

