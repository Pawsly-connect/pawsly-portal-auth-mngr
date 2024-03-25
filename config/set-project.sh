if [ -f .git/hooks/pre-commit.sample ]; then
    echo "Cambiando nombre del archivo pre-commit.sample"
    cd .git/hooks
    mv pre-commit.sample pre-commit
    cd ../..
fi

ln -sf .git/hooks/pre-commit .github/hooks/pre-commit

if [ -f .env ]; then
    echo ".env ya existe, saltando..."
else
    cp -i .env.example .env
fi

REQUIRED_TOOLS=('aws' 'docker' 'node' 'npm')

for TOOL in ${REQUIRED_TOOLS[@]}; do
    TOOL_VERSION=$($TOOL --version)
    if [ $? -ne 0 ]; then
        echo "X $TOOL - Asegurese que $TOOL esta instalado"
    else
        echo "✓ $TOOL - version: $TOOL_VERSION"
    fi
done
