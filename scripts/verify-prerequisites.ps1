$ErrorActionPreference = "Stop"
Write-Host "Checking Docker..."
docker version | Out-Null
docker compose version | Out-Null
Write-Host "Checking required files..."
$required = @("CLAUDE.md", "AUTOMATION_PROMPTS.md", "automation/pipeline.yaml", "automation/gates.yaml")
foreach ($f in $required) { if (-not (Test-Path $f)) { throw "Missing $f" } }
Write-Host "Prerequisites OK"
