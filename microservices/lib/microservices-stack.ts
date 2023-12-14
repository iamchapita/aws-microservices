import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { SwnDatabase } from "./database";
import { SwnMicroservices } from "./microservice";
import { SwnApiGateway } from "./apigateway";
import { SwnEventBus } from "./eventBus";

export class MicroservicesStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const database = new SwnDatabase(this, "Database");

		const microservices = new SwnMicroservices(this, "Microservices", {
			productTable: database.productTable,
			basketTable: database.basketTable,
			orderTable: database.orderTable,
		});

		const apiGateway = new SwnApiGateway(this, "ApiGateway", {
			productMicroservice: microservices.productMicroservice,
			basketMicroservice: microservices.basketMicroservice,
			orderMicroservice: microservices.orderMicroservice,
		});

		const eventBus = new SwnEventBus(this, "EventBus", {
			publisherFunction: microservices.basketMicroservice,
			targetFunction: microservices.orderMicroservice,
		});
	}
}
