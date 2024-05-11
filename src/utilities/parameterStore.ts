import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const client = new SSMClient({
  region: process.env.REGION_AWS_LAMBDA
});

export async function getParam(name: string, decrypted:boolean = false) {
  try {
    const input = {
      Name: name,
      WithDecryption: decrypted,
    };
    const command = new GetParameterCommand(input);
    const response = await client.send(command);
    console.log(response.Parameter.value)
    return response.Parameter.value;
  } catch (error: any) {
    throw new Error(error);
  } finally {
    if(client){client.destroy()};
  }
}
