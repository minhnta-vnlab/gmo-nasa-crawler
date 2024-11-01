import dotenv from 'dotenv'

dotenv.config()

interface Env {
    OPENAI_KEY: string,
    CRAWL_SERVER_HOST: string,
    CRAWL_SERVER_PORT: number,
    SLACK_OATH_TOKEN: string
    SLACK_CHANNEL_LIST: {team: string, channel: string}[]
}

const env: Env = {
    OPENAI_KEY: process.env.OPENAI_KEY ?? "",
    CRAWL_SERVER_HOST: process.env.CRAWL_SERVER_HOST ?? "localhost",
    CRAWL_SERVER_PORT: parseInt(process.env.CRAWL_SERVER_PORT ?? "8080"),
    SLACK_OATH_TOKEN: process.env.SLACK_OATH_TOKEN ?? "",
    SLACK_CHANNEL_LIST: process.env.SLACK_CHANNEL_LIST 
        ? 
        process.env.SLACK_CHANNEL_LIST.split(",")
        .map(e => e.split("/"))
        .map(e => ({team: e[0], channel: e[1]})) 
        : []
}


export default env