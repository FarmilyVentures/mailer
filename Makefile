deploy:
	SLS_DEBUG=* serverless deploy -v

test_contact:
	serverless invoke -f mail -l --path contact.json  -v

test_order:
	serverless invoke -f mail -l --path order.json  -v

log:
	serverless  logs --function mail -v