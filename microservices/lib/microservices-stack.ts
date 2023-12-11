import * as cdk from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import {
	NodejsFunction,
	NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

export class MicroservicesStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const productTable = new Table(this, "product", {
			partitionKey: {
				name: "id",
				type: AttributeType.STRING,
			},
			tableName: "product",
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			billingMode: BillingMode.PAY_PER_REQUEST,
		});

		const nodejsFunctionProps: NodejsFunctionProps = {
			bundling: {
				externalModules: ["aws-sdk"],
			},
			environment: {
				PRIMARY_KEY: "id",
				DYNAMODB_TABLE_NAME: productTable.tableName,
			},
			runtime: Runtime.NODEJS_20_X,
		};

		const productFunction = new NodejsFunction(
			this,
			"productLambdaFunction",
			{
				entry: join(__dirname, "../src/product/index.js"),
				...nodejsFunctionProps,
			}
		);

		productTable.grantReadWriteData(productFunction);

		const apiGateway = new LambdaRestApi(this, "productAPI", {
			restApiName: "Product Service",
			handler: productFunction,
			proxy: false,
		});

		const product = apiGateway.root.addResource("product");
		product.addMethod("GET");
		product.addMethod("POST");

		const singleProduct = product.addResource("{id}");
		singleProduct.addMethod("GET");
		singleProduct.addMethod("PUT");
		singleProduct.addMethod("DELETE");
	}
}
