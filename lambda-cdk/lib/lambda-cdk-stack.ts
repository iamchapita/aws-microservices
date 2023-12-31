import * as cdk from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class LambdaCdkStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// Lambda
		const hello = new Function(this, "HelloHandler", {
			runtime: Runtime.NODEJS_20_X,
			code: Code.fromAsset("lambda"),
			handler: "hello.handler",
		});

		// Gateway
		new LambdaRestApi(this, "ApiGateway", {
			handler: hello,
		});
	}
}
