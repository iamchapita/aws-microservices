import { IFunction } from "aws-cdk-lib/aws-lambda";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { EventBus, Rule } from "aws-cdk-lib/aws-events";

import { Construct } from "constructs";

interface SwnEventBusProps {
	publisherFunction: IFunction;
	targetFunction: IFunction;
}

export class SwnEventBus extends Construct {
	constructor(scope: Construct, id: string, props: SwnEventBusProps) {
		super(scope, id);
		const bus = new EventBus(this, "SwnEventBus", {
			eventBusName: "SwnEventBus",
		});

		const checkoutBasketRule = new Rule(this, "CheckoutBasketRule", {
			eventBus: bus,
			enabled: true,
			description: "Whe Basket microservice checkout the basket",
			eventPattern: {
				source: ["com.swn.checkoutbasket"],
				detailType: ["CheckoutBasket"],
			},
			ruleName: "CheckoutBasketRule",
		});

		checkoutBasketRule.addTarget(new LambdaFunction(props.targetFunction));

		bus.grantPutEventsTo(props.publisherFunction);
	}
}
