#!/usr/bin/env just
# Use requires installation of https://github.com/casey/just

# Integrate environment variables from, .e.g., ../.env
set dotenv-load := true

PORT := "3000"

root := justfile_directory()

_default:
    @just --list

# Serve local content on {{PORT}}
serve:
    #!/usr/bin/env bash
    check_port() {
       nc -z localhost {{PORT}} 2>/dev/null
    }
    # npx serve --help
    # npx serve --cors &
    if ! check_port; then
       npx serve --no-clipboard --no-etag --cors &
       while ! check_port ; do
          printf "." 1>&2
          sleep .5
       done
       open "http://localhost:{{PORT}}"
       #open {{invocation_directory()}}/index.html
    else
       printf "%s already in use\n" "$PORT"
       lsof -i:{{PORT}}
    fi

# Stop serving local content on {{PORT}}
stop:
    lsof -i:{{PORT}}
    pkill -f .bin/serve

# Show status of {{PORT}}
status:
    lsof -i:{{PORT}}
