## pawsly-portal-auth-mngr

### To develop in local

Requirements:
- AWS CLI (Version 2.15.30 recommended)
- Node JS (Version 20.11.1 recommended)
- Docker (Version 25.0.3 recommended)

1. Start docker instance of DynamoDB local with `docker-compose up`
2. Create the table in DynamoDB local from AWS CLI with:
    ```bash
    aws dynamodb create-table ^
    --table-name users ^
    --attribute-definitions ^
        AttributeName=email,AttributeType=S ^
        AttributeName=dateRegister,AttributeType=S ^
    --key-schema ^
        AttributeName=email,KeyType=HASH ^
        AttributeName=dateRegister,KeyType=RANGE ^
    --provisioned-throughput ^
        ReadCapacityUnits=5,WriteCapacityUnits=5 ^
    --table-class STANDARD --region us-east-1 --endpoint-url http://localhost:8000
    ```
3. Install node libraries with `npm i`
4. Start server with `npm run local`
