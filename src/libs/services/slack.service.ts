import { WebClient, LogLevel } from "@slack/web-api";
import env from "../../env";
import { channel } from "diagnostics_channel";

export const slackClient = new WebClient(env.SLACK_OATH_TOKEN, {
    logLevel: LogLevel.INFO
})

export class SlackService {
    client: WebClient
    constructor(client: WebClient) {
        this.client = client
    }

    async listConversations() {
        const result = await this.client.conversations.list()
        return result
    }

    async publishMessage(channelId: string, message: string) {
        return this.client.chat.postMessage({
            channel: channelId,
            text: message,
        })
    }

    async publicMessageBlock(channelId: string, blocks: any) {
        return this.client.chat.postMessage({
            channel: channelId,
            blocks: blocks
        })
    }
}

const slackService = new SlackService(slackClient)

export default slackService