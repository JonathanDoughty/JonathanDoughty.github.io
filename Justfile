#!/usr/bin/env just
# Use requires installation of https://github.com/casey/just

# Integrate environment variables from, .e.g., ../.env
set dotenv-load := true

PORT := "3101"

root := justfile_directory()

_default:
    printf "Using port: %d\n" "{{PORT}}"
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
       npx serve --no-clipboard --no-etag -p {{PORT}} &> npx.log &
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
    just _tailscale_off

_tailscale_off:
    #!/usr/bin/env bash
    if tailscale serve status | grep -q {{PORT}}; then
       tailscale serve --bg --https={{PORT}} http://127.0.0.1:{{PORT}} off
    fi

# Toggle tailscale serve of content on {{PORT}}
tailscale:
    #!/usr/bin/env bash
    if lsof -i:{{PORT}} | grep -q node; then
       if tailscale serve status | grep -q {{PORT}}; then
          just _tailscale_off
       else
          tailscale serve --bg --https={{PORT}} http://127.0.0.1:{{PORT}}
       fi
    else
       : # ?
    fi

# Show status of {{PORT}}
status:
    #!/usr/bin/env bash
    lsof -i:{{PORT}} || printf "Nothing running on port %d\n" "{{PORT}}"
    tailscale serve status | grep {{PORT}} || printf "No tailscale service on port %d\n" "{{PORT}}"
