$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$port = 3951
Start-Process "http://127.0.0.1:$port/"
if (Get-Command py -ErrorAction SilentlyContinue) {
  & py -m http.server $port --bind 127.0.0.1
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
  & python -m http.server $port --bind 127.0.0.1
} else {
  throw "Python 3 is required to run the local static server."
}
