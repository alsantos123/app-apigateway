import * as util from "util";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import Redis from "./Redis";
import Log, { LogTipo } from "./Log";
import API from "./API";
interface IGet {
    ok: boolean,
    data: null|string,
    erro?: string
}

export const handler = async ( event: APIGatewayProxyEvent ): Promise<APIGatewayProxyResult> =>
{
	let httpResponse = 
	{
		statusCode: 200,
		body: "",
		headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Headers": "Authorization,Content-Type",
					"Access-Control-Allow-Methods": "GET,POST",
				}
    } as APIGatewayProxyResult;

    const ret = {ok: true} as IGet;

    try
    {
        // REDIS
        // const key = "teste";
        // const redis = new Redis();

        // await redis.conectar();

        // await redis.set(key, "alicia");
        // const str = await redis.get(key+2);

        // ret.data = str;
        // console.debug(str);

        // LOGGROUP
        // const log = new Log();
        // await log.log("teste 22", LogTipo.ERRO);

        // API
        const a = new API();
        const res = await a.get("https://asantos2.me") ;
        ret.data = inspect(res);
        // console.debug(ret.data);
    }
    catch(e)
    {
        ret.ok = false;
        ret.erro = e;
        
        console.error("index.ts", inspect(e));
        
        const log = new Log();
        await log.log(ret.erro as string, LogTipo.ERRO);
    }

    httpResponse.body = JSON.stringify(ret);

    return httpResponse;
}

function inspect(obj: any)
{
    return util.inspect(obj, true, 10, true);
}