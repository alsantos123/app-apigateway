import redis from "redis";
import AppConfig from './app-config';

export default class Redis
{
    private ttl = 60 * 60 * 6; // 6 horas
    private client : redis.RedisClient|null = null;
    public ativo = false;

    constructor()
    {
    }
    
    public conectar()
    {
        return new Promise((done, erro) => 
        {
            if(!AppConfig.Redis.Ativo) 
            {
                erro("Redis desativado no AppConfig");
                return;
            }

            this.client = redis.createClient({host: AppConfig.Redis.Host});

            this.client.on("connect", () => {
                this.ativo = true;
                done(true);
            });

            this.client.on("error", (e: any) => {
                erro(e);
            });

        });
    }

    public set(chave: string, valor: string)
    {
        return new Promise((done: (bln:boolean) => void, erro) => 
        {
            if(!this.ativo) erro("Redis não conectado");
    
            this.client?.set(chave, valor, (err: any) => 
            {
                if(err) erro(err);

                this.client?.expire(chave, this.ttl, (err: any) => {
                    if(err) console.log("erro no expire " + chave + " => " + err);
                    done(true);
                });
            });

        });

    }

    public get(chave: string)
    {
        return new Promise((done: (valor: string|null) => void, erro) => 
        {
            if(!this.ativo) erro("Redis não conectado");
    
            this.client?.get(chave, (err: any, valor: any) => 
            {
                if(err) erro(err);
                done(valor);
            });
        });
    }
}