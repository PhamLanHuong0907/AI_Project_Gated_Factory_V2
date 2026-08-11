$ErrorActionPreference = "Stop"
if (-not (Get-Command graphify -ErrorAction SilentlyContinue)) { throw "graphify command not found" }
# Use the actual Graphify command supported by the installed version.
# Do not silently invent unsupported subcommands. Inspect `graphify --help` first.
graphify --help
Write-Host "Run the repository-supported extract/build command and verify graphify-out/graph.json."
