# exist_bucket branch

* Use an existing S3 bucket
* Pass the access log under the specified prefix to the moveAccessLogs function
    * NewKeyPrefix parameter is unused
* Stop S3 event notification and change to scheduled execution
    * S3 events must reference an S3 bucket in the same template.

## Usage

```
sam deploy --guided

	Setting default arguments for 'sam deploy'
	=========================================
	Stack Name [sam-app]: 
	AWS Region [us-east-1]: 
	Parameter ResourcePrefix [myapp]: 
	Parameter GzKeyPrefix [partitioned-gz/]: 
	Parameter ParquetKeyPrefix [partitioned-parquet/]: 
	Parameter CloudFrontAccessLogsBucket []: 
	Parameter TargetKeyPrefixesToMove []: 
	Parameter MoveNewAccessLogsWrapperEventSchedule [cron(0/15 * * * ? *)]:
	Parameter MoveNewAccessLogsWrapperTimeout [600]:
	#Shows you resources changes to be deployed and require a 'Y' to initiate deploy
	Confirm changes before deploy [y/N]: 
	#SAM needs permission to be able to create roles to connect to the resources in your template
	Allow SAM CLI IAM role creation [Y/n]: 
	Save arguments to configuration file [Y/n]: 
	SAM configuration file [samconfig.toml]: 
	SAM configuration environment [default]: 
```
