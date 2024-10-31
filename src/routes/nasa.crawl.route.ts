import { FastifyInstance, FastifyPluginOptions } from "fastify"
import crawlController from "../controllers/nasa.crawl.controller";

const crawlRoute = async function (fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.get("/news", crawlController.getNews)
    fastify.post("/news/crawl", crawlController.crawlNews);
}

export default crawlRoute;