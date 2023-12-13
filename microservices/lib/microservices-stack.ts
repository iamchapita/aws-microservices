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
	}
}