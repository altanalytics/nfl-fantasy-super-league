import { defineBackend } from '@aws-amplify/backend';
import { Stack } from "aws-cdk-lib";
import {
  AuthorizationType,
  Cors,
  LambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

import { nflApi } from './functions/nfl-api/resource';

export const backend = defineBackend({
  nflApi,
});

// Add S3 permissions to the Lambda function
backend.nflApi.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ["s3:GetObject", "s3:PutObject"],
    resources: ["arn:aws:s3:::alt-nfl-bucket/*"],
  })
);

// Create a new API stack
const apiStack = backend.createStack("nfl-fantasy-api-stack");

// Create a new REST API
const nflRestApi = new RestApi(apiStack, "nfl-fantasy-api", {
  restApiName: "nfl-fantasy-api",
  deploy: true,
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: Cors.ALL_METHODS,
    allowHeaders: Cors.DEFAULT_HEADERS,
  },
});

// Create Lambda integration
const lambdaIntegration = new LambdaIntegration(backend.nflApi.resources.lambda, {
  proxy: true, // Use proxy integration for simplicity
});

// Add the /teams resource
const teamsResource = nflRestApi.root.addResource('teams');
teamsResource.addMethod('GET', lambdaIntegration, {
  authorizationType: AuthorizationType.NONE,
});

// Add the /schedule resource
const scheduleResource = nflRestApi.root.addResource('schedule');
scheduleResource.addMethod('GET', lambdaIntegration, {
  authorizationType: AuthorizationType.NONE,
});

// Add the /scoreboard resource
const scoreboardResource = nflRestApi.root.addResource('scoreboard');
scoreboardResource.addMethod('GET', lambdaIntegration, {
  authorizationType: AuthorizationType.NONE,
});

// Add the /log-access resource
const logAccessResource = nflRestApi.root.addResource('log-access');
logAccessResource.addMethod('POST', lambdaIntegration, {
  authorizationType: AuthorizationType.NONE,
});

// Add the API to outputs
backend.addOutput({
  custom: {
    API: {
      [nflRestApi.restApiName]: {
        endpoint: nflRestApi.url,
        region: Stack.of(nflRestApi).region,
        apiName: nflRestApi.restApiName,
      },
    },
  },
});
