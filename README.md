### GMO Nasa Crawler
Crawl from https://nasa.gmo.jp and automatically send news to Slack
## Setup
### Environments
Create `.env` and `.env.docker` by the following example:
```env
# change to 'crawlserver' for Docker
CRAWL_SERVER_HOST=127.0.0.1
CRAWL_SERVER_PORT=8080

SLACK_OATH_TOKEN=oauth-token
# <array of channel id. ex: 'team1/channel1,team2/channel2'>
SLACK_CHANNEL_LIST=team1/channel1,team2/channel2
```
### Development
Install dependencies
```
npm i
```
Run `server.ts` and `cron.ts` in nodemon
```
npm run dev
```
#### Build
Build to `.js` inside `build/` folder
```
npm run build
```
Run Crawl server
```
npm run start
```
Run Cron job:
```
npm run cron
```
### Docker
```
docker compose up -d
```
