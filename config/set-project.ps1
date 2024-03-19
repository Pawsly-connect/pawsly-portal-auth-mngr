if (Test-Path -Path ".git\hooks\pre-commit.sample" -PathType Leaf) {
    Write-Output "Cambiando nombre del archivo pre-commit.sample"
    Rename-Item -Path ".git\hooks\pre-commit.sample" -NewName "pre-commit"
}

cmd /c mklink /H .github\hooks\pre-commit .git\hooks\pre-commit

if (Test-Path -Path ".env" -PathType Leaf) {
    Write-Output ".env ya existe, saltando..."
}else{
    Copy-Item ".env.example" -Destination ".env"
}

$REQUIRED_TOOLS = @('aws','docker','node','npm')

$REQUIRED_TOOLS | ForEach-Object {
    $TOOL_VERSION = cmd /c $PSItem --version
    if ($?) {
        Write-Output "√ $PSItem - version: $TOOL_VERSION"
    }else{
        Write-Output "X $PSItem - Asegurese que $PSItem esta instalado"
    }
}
