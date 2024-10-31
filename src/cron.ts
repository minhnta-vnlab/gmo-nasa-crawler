import nodeCron from 'node-cron'
import env from './env';
import slackService from './libs/services/slack.service';
import { NasaNew } from './types/nasa.type';

// Simple cron job
// TODO: make it better later
export const cron = {
    async start(debug=true) {
        console.info("[INFO] - CRON JOB: Starting cron job");

        const task = nodeCron.schedule('*/5 * * * * *', async () => {
            if(debug) {
                console.debug("[DEBUG] - NASA NEWS CRAWL: Start")
            }
            const res = await fetch(`http://${env.CRAWL_SERVER_HOST}:${env.CRAWL_SERVER_PORT}/nasa/news/crawl`, {
                method: "POST",
                headers: {
                    "Accept": "application/json"
                }
            })
            .then(res => res.json())
            .catch((err: TypeError) => {
                console.debug(`[ERROR] - NASA NEWS CRAWL: ${err} - ${err.message}`)
            })

            if(res.length) {
                console.info(`[INFO] - NASA NEWS CRAWL: Got ${res.length} news`)
                const news = res.news as NasaNew[]

                news.forEach(n => {
                    const message = `Hey! Got some news: \n${n.title}\nDetail: ${n.link}`;
                    env.SLACK_CHANNEL_LIST.forEach(c => {
                        console.info(`[INFO] - NASA NEWS CRAWL: Sending ${n.link} to ${c.team}/${c.channel}`)
                        slackService.publishMessage(c.channel, message)
                    })
                })
            } else {
                console.info("[INFO] - NASA NEWS CRAWL: Got nothing news")
            }
        })


        console.info("[INFO] - CRON JOB: Starting NASA NEWS CRAWL task")
        task.start()
    }
}

// Start cron job
cron.start()