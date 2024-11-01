import { FastifyReply, FastifyRequest } from "fastify";
import nasaCrawler from "../libs/crawlers/nasa.crawler";
import { NasaNew } from "../types/nasa.type";
import fileCache from "../utils/cache/file.cache";
import nasa from "../consts/api/nasa.const";
import puppeteer from 'puppeteer';

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

    async fetchNewsDetails(news: NasaNew[]): Promise<NasaNew[]> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
    
        for (const newsItem of news) {
            await page.goto(newsItem.link);
    
            // Lấy nội dung từ class notice hoặc main
            const noticeContent = await page.evaluate(() => {
                const noticeElement = document.querySelector('.notice');
                if (noticeElement) {
                    const title = noticeElement.querySelector('.notice__title')?.textContent?.trim() || '';
                    const name = noticeElement.querySelector('.notice__name')?.textContent?.trim() || '';
                    const summary = noticeElement.querySelector('.notice__summary')?.textContent?.trim() || '';
                    const content = noticeElement.querySelector('.notice__content')?.textContent?.trim() || '';
                    return `${title}\n${name}\n${summary}\n${content}`;
                } else {
                    const mainElement = document.querySelector('main');
                    if (mainElement) {
                        const title = mainElement.querySelector('.news-title h1')?.textContent?.trim() || '';
                        const date = mainElement.querySelector('.news-title .date')?.textContent?.trim() || '';
                        const content = mainElement.querySelector('.news-content')?.textContent?.trim() || '';
                        return `${title}\n${date}\n${content}`;
                    }
                }
                return null;
            });
    
            if (noticeContent) {
                newsItem.summary = noticeContent;
            }
        }
    
        await browser.close();
        return news;
    }

    async clear(request: FastifyRequest, reply: FastifyReply) {
        fileCache.clear(nasa.cacheFile.news)
    }
}

const crawlController = new CrawlController();
export default crawlController;