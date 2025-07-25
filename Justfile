#!/usr/bin/env just
# Use requires installation of https://github.com/casey/just

# Integrate environment variables from, .e.g., ../.env
set dotenv-load := true

root := justfile_directory()

_default:
    @just --list

preview:
    #!/usr/bin/env bash
    # npx serve --help
    # npx serve --cors &
    npx serve &
    addr=$(pbpaste)
    printf "waiting on %s\n" "$addr"
    while ! nc -z $(echo "${addr##*/}" | sed 's/:/ /') 2>/dev/null; do
       printf "." 1>&2
       sleep .5
    done
    open "$addr"
    #open {{invocation_directory()}}/index.html
