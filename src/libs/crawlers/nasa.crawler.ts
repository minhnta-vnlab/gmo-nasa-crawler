import { NasaNewFetch } from "../../types/nasa.type";
import nasaAxios from "../../utils/axios/nasa.axios";
import xml2js from 'xml2js'

type NasaLangChoice = "jp" | "vi" | "en" | "zh" | "th";

const parser = new xml2js.Parser({ explicitArray: false });

export class NasaCrawler {
    lang: string
    constructor(lang: NasaLangChoice = "vi") {
        this.lang = lang
    }

    async getNews(): Promise<NasaNewFetch[]> {
        return nasaAxios.get(`${this.lang}/rss/news/all`)
            .then(res => parser.parseStringPromise(res.data))
            .then(data => data.rss.channel.item)
    }
}

const nasaCrawler = new NasaCrawler();

export default nasaCrawler;