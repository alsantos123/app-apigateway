import * as util from "util";
import axios, {AxiosError} from "axios";
import Log, {LogTipo} from "./Log";

const AXIOS_TIMEOUT = 5 * 1000;

export default class API
{
    constructor() {}

    public async get(url: string, headers: any = {})
    {
        try
        {
            return await axios.get(url, {
                timeout: AXIOS_TIMEOUT,
                headers: headers
            })
        }
        catch(e)
        {
            throw await this._httpError(e);
            // return this._httpError(e);
        }
    }

    public async post(url: string, payload: string|null = null, headers: any = {})
    {
        // const headers = { "Content-Type": "application/x-www-form-urlencoded" }
        try
        {
            return await axios.post(url, payload, {
                headers:  headers,
                timeout: AXIOS_TIMEOUT ,
            });
        }
        catch(e)
        {
            throw await this._httpError(e);
        }
    }

    protected async _log(msg: any, tipo: LogTipo = LogTipo.ERRO)
    {
        const str = util.inspect(msg, true, 10, false);
        
        console.error(str);
        
        // const l = new Log();
        // await l.log(str, tipo)
    }

    protected async _httpError(httpError: AxiosError) 
    {
        await this._log(">>> API._httpError(axiosError)");
        await this._log(httpError.message);

        await this._log(">>> Response status e data:");
        await this._log(httpError.response?.status);
        await this._log(httpError.response?.data);

        await this._log(">>> Request url, headers e data:");
        await this._log(httpError.config.url);
        await this._log(httpError.config.headers);
        await this._log(httpError.config.data);

        return httpError.message;
    }
}