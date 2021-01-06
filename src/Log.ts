import appConfig from "./app-config";

import * as AWS from 'aws-sdk';
import { InputLogEvent, Tags } from "aws-sdk/clients/cloudwatchlogs";

enum enumStreams {
    INFO = "INFO",
    DEBUG = "DEBUG",
    ERRO = "ERRO"
}

export default class Log
{
    private cw: AWS.CloudWatchLogs;
    
    constructor() 
    {
        this.cw = new AWS.CloudWatchLogs({region: appConfig.Loggroup.region});
    }

    public async erro(msg: string)
    {
        await this._setup();
        
        await this._log(enumStreams.ERRO, msg);
    }

    private async _setup()
    {
        await await this.cw.createLogGroup({
				logGroupName: appConfig.Loggroup.nome,
				tags: {
					"Descricao": appConfig.Loggroup.descricao
				} as Tags
			}).promise();

        await this.cw.putRetentionPolicy({
            logGroupName: appConfig.Loggroup.nome,
            retentionInDays: 90
        }).promise();

        await this.cw.createLogStream({
            logGroupName: appConfig.Loggroup.nome,
            logStreamName: enumStreams.INFO
        }).promise();

        await this.cw.createLogStream({
            logGroupName: appConfig.Loggroup.nome,
            logStreamName: enumStreams.DEBUG
        }).promise();

        await this.cw.createLogStream({
            logGroupName: appConfig.Loggroup.nome,
            logStreamName: enumStreams.ERRO
        }).promise();
    }

    private async _log(stream: enumStreams, msg: string)
    {
        /// Loga o evento
		const evento = {
			timestamp: new Date().getTime(),
			message: msg
        } as InputLogEvent;
        
		let resPut = null;
		
		try
		{
			const resDesc = await this.cw.describeLogStreams({
				logGroupName: appConfig.Loggroup.nome,
				logStreamNamePrefix: stream
			}).promise();

			const strSeqToken = resDesc.logStreams?.length ? resDesc.logStreams[0].uploadSequenceToken : "";

			resPut = await this.cw.putLogEvents({
				logGroupName: appConfig.Loggroup.nome,
				logStreamName: stream,
				logEvents: [evento],
				sequenceToken: strSeqToken
			}).promise();

		}
		catch(e) 
		{
			if(resPut && resPut.nextSequenceToken)
			{
				console.debug("resPut:", resPut);

				try {
					resPut = await this.cw.putLogEvents({
						logGroupName: appConfig.Loggroup.nome,
						logStreamName: stream,
						logEvents: [evento],
						sequenceToken: resPut.nextSequenceToken
					}).promise();
				}
				catch(e2){ console.error("erro no putLogEvents_2(): ", e2); throw(e2) };
			}

			console.error("erro no putLogEvents(): ",  JSON.stringify(e));
			// throw(e);
		}
    }
}