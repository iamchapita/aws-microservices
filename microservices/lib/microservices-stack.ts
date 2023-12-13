import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { SwnDatabase } from "./database";
import { SwnMicroservices } from "./microservice";
import { SwnApiGateway } from "./apigateway";

export class MicroservicesStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const database = new SwnDatabase(this, "Database");
		const microservices = new SwnMicroservices(this, "Microservices", {
			productTable: database.productTable,
		});
		const apiGateway = new SwnApiGateway(this, "ApiGateway", {
			productMicroservice: microservices.productMicroservice,
		});
		/* const productTable = new Table(this, "product", {
			partitionKey: {
				name: "id",
				type: AttributeType.STRING,
			},
			tableName: "product",
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			billingMode: BillingMode.PAY_PER_REQUEST,
		}); */

		/* const nodejsFunctionProps: NodejsFunctionProps = {
			bundling: {
				externalModules: ["aws-sdk"],
			},
			environment: {
				PRIMARY_KEY: "id",
				DYNAMODB_TABLE_NAME: database.productTable.tableName,
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
		
		database.productTable.grantReadWriteData(productFunction);*/

		/* const apiGateway = new LambdaRestApi(this, "productAPI", {
			restApiName: "Product Service",
			handler: microservices.productMicroservice,
			proxy: false,
		});

		const product = apiGateway.root.addResource("product");
		product.addMethod("GET");
		product.addMethod("POST");

		const singleProduct = product.addResource("{id}");
		singleProduct.addMethod("GET");
		singleProduct.addMethod("PUT");
		singleProduct.addMethod("DELETE"); */
	}
}
