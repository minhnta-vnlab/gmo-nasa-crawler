export type NasaNewFetch = {
    category: string; // e.g., "緊1/3-重2/3"
    title: string; // e.g., "[Reply Requested][任意]【リマインド】健康ストレッチ 満足度アンケート【10/31(木)23:59期限】"
    description: string; // e.g., "健康ストレッチに関する満足度アンケートが、本日回答締日となっております..."
    link: string; // e.g., "https://nasa.gmo.jp/en/notice/16818"
    pubDate: string; // e.g., "Thu, 31 Oct 2024 10:30:00 +0900"
}

export type NasaNew = Pick<NasaNewFetch, "title" | "pubDate" | "link"> & {
    summary?: string | null
}