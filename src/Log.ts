import appConfig from "./app-config";

import * as AWS from 'aws-sdk';
import { InputLogEvent, Tags } from "aws-sdk/clients/cloudwatchlogs";

export enum LogTipo {
    INFO  = "INFO",
    DEBUG = "DEBUG",
    ERRO  = "ERRO"
}

export default class Log
{
    private cw: AWS.CloudWatchLogs;
    private setup = false;
    
    constructor() 
    {
        this.cw = new AWS.CloudWatchLogs({region: appConfig.Loggroup.region, maxRetries: 2, httpOptions: {timeout: 5, connectTimeout: 10}});
    }

    public async log(msg: string, tipo: LogTipo)
    {
        await this._setup();
        await this._log(msg, tipo);
    }

    private async _setup()
    {
        if(this.setup) return true;
        this.setup = true;

        try
        {
            await this.cw.createLogGroup({
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
                logStreamName: LogTipo.INFO
            }).promise();

            await this.cw.createLogStream({
                logGroupName: appConfig.Loggroup.nome,
                logStreamName: LogTipo.DEBUG
            }).promise();

            await this.cw.createLogStream({
                logGroupName: appConfig.Loggroup.nome,
                logStreamName: LogTipo.ERRO
            }).promise();
        }
        catch(e)
        {
            console.error(e);
            return false;
        }

        return true;
    }

    private async _log(msg: string, tipo: LogTipo)
    {
		const evento = {
			timestamp: new Date().getTime(),
			message: msg
        } as InputLogEvent;
        
		let resPut = null;
		
		try
		{
			const resDesc = await this.cw.describeLogStreams({
                logGroupName: appConfig.Loggroup.nome,
                logStreamNamePrefix: tipo
			}).promise();

			const strSeqToken = resDesc.logStreams?.length ? resDesc.logStreams[0].uploadSequenceToken : "";

			resPut = await this.cw.putLogEvents({
				logGroupName: appConfig.Loggroup.nome,
				logStreamName: tipo,
				logEvents: [evento],
				sequenceToken: strSeqToken
            }).promise();
		}
		catch(e) 
		{
			if(resPut && resPut.nextSequenceToken)
			{
				try {
					resPut = await this.cw.putLogEvents({
						logGroupName: appConfig.Loggroup.nome,
						logStreamName: tipo,
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