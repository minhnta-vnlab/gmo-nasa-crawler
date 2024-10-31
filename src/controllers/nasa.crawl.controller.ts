import { FastifyReply, FastifyRequest } from "fastify";
import nasaCrawler from "../libs/crawlers/nasa.crawler";
import { NasaNew } from "../types/nasa.type";
import fileCache from "../utils/cache/file.cache";
import nasa from "../consts/api/nasa.const";
import slackService from "../libs/services/slack.service";

class CrawlController {
    async getNews(request: FastifyRequest, reply: FastifyReply): Promise<NasaNew[]> {
        const news = fileCache.get(nasa.cacheFile.news)
        if(!news) {
            return []
        }
        return news
    }

    async crawlNews(request: FastifyRequest, reply: FastifyReply) {
        const news = await nasaCrawler.getNews()
        const croppedNews = news.map(n => ({title: n.title, link: n.link, pubDate: n.pubDate}))

        const cachedNews = (fileCache.get(nasa.cacheFile.news) ?? []) as NasaNew[]
        const cachedLinks = new Set(cachedNews.map(item => item.link));

        const filteredNews = croppedNews.filter(n => !cachedLinks.has(n.link))

        if(filteredNews.length > 0) {
            const newCachedNews = cachedNews.concat(filteredNews)
            fileCache.set(nasa.cacheFile.news, newCachedNews)
        }

        return {
            message: "Success",
            length: filteredNews.length,
            news: filteredNews,
        }
    }

    async clear(request: FastifyRequest, reply: FastifyReply) {
        fileCache.clear(nasa.cacheFile.news)
    }
}

const crawlController = new CrawlController();
export default crawlController;