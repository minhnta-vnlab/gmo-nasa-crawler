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

                
                const headerBlock = {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": "Thông báo mới từ GMO Nasa",
                        "emoji": true
                    }
                }

                // Map each new, add summary
                news.map(n => {
                    n.summary = "<summary here>"
                });
                
                env.SLACK_CHANNEL_LIST.forEach(c => {
                    const newsBlocks = news.map(item => ({
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `*${item.title}*\n${item.summary}`
                        },
                        "accessory": {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Xem chi tiết",
                                "emoji": true
                            },
                            "url": item.link
                        }
                    }));
                    const blocks = [headerBlock, ...newsBlocks]

                    slackService.publicMessageBlock(c.channel, blocks)
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