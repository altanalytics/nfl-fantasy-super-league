import { defineBackend } from '@aws-amplify/backend';
import { Stack } from "aws-cdk-lib";
import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import {
  AuthorizationType,
  Cors,
  LambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";

import { nflApi } from './functions/nfl-api/resource';

export const backend = defineBackend({
  nflApi,
});

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

    // Grant Lambda job access to S3 and Secrets Manager
    const smPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ["secretsmanager:*", "s3:*",'lambda:*',],
    });

// Add Docker for R backend 
 const nflRlambda = new lambda.DockerImageFunction(apiStack, `NFL_R_DataGrab`, {
      functionName: `NFL_R_DataGrab`,
      initialPolicy: [smPolicy],
      retryAttempts: 0,
      architecture: lambda.Architecture.ARM_64,
      code: lambda.DockerImageCode.fromImageAsset('amplify/r_data', {
        platform: ecr_assets.Platform.LINUX_ARM64,
      }),
      memorySize: 2048,
      timeout: Duration.seconds(590),
      environment: {
      //  GIT_BRANCH: branchName, 
      },
    });

     ///// RULES CONFIGURATION /////
    // Function to create event rules
    const createRule = (ruleName: string, schedule: events.Schedule, message: any) => {
      const rule = new events.Rule(apiStack, ruleName, { schedule });
      rule.addTarget(new LambdaFunction(nflRlambda, {
        event: events.RuleTargetInput.fromObject(message),
      }));
    };

    // Define schedules and messages for rules
    const schedules = [
      { name: `daily_grab`, 
        cron: events.Schedule.cron({ minute: '55', hour: '11', month: '*', weekDay: '*', year: '*' }), 
        msg: { lambda_input: { msg: 'daily' } } },
   //   { name: `webs_market_close_rule_${branchName}`, 
   //      cron: events.Schedule.cron({ minute: '40', hour: '16-22', month: '*', weekDay: 'MON-FRI', year: '*' }), 
   //      msg: { lambda_input: { msg: 'market_close' } } },
      { name: `in_game_refresh`, 
        //cron: events.Schedule.cron({ minute: '9,19,29,39,49,59', hour: '12-23', month: '*', weekDay: 'MON-FRI', year: '*' }), 
        cron: events.Schedule.cron({ minute: '0/10', hour: '12-23', month: '*', weekDay: 'SUN', year: '*' }), 
        msg: { lambda_input: { msg: 'snapshot' } } },
      // Add more rule configurations here
     ];

    // Create rules
    schedules.forEach(({ name, cron, msg }) => createRule(name, cron, msg));

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
