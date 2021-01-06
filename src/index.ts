import * as util from "util";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import Redis from "./Redis";
import Log from "./Log";
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
        // await log.erro("teste");
    }
    catch(e)
    {
        console.error("index.ts", e);
        ret.ok = false;
        ret.erro = util.inspect(e, true, 10, true);
    }

    httpResponse.body = JSON.stringify(ret);

    return httpResponse;
}