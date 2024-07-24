// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html


const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
  
async function getSecret(secretName) {  
const secret_name = secretName;
  
  
  const client = new SecretsManagerClient({
    region: "us-east-1"
  });
  
  let response;
  
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }

  const secret =response.SecretString;
  return secret;
}
/*
  var values =  getSecret();
  console.log(values);
  console.log(values.username);
  console.log(values.password);
  console.log(values.host);
  console.log(values.username);
*/






module.exports= getSecret;