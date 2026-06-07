/**
 * RSS parse quality validator
 *
 * === 역할 ===
 * RSS → parseRSS 결과 품질 검증
 *
 * === 검증 항목 ===
 * - title
 * - description
 * - content
 * - author
 * - publishedAt
 * - categories
 *
 * === 특징 ===
 * - DB 사용 안 함
 * - 저장 안 함
 * - parse 품질만 확인
 */

import axios from "axios";
import { parseRSS } from "@/ingestion/rss/parseRss";

const FEEDS = [
  //   "https://hnrss.org/frontpage",
  "https://feeds.feedburner.com/geeknews-feed",
];

async function run() {
  for (const feedUrl of FEEDS) {
    console.log("\n====================================");
    console.log(`FEED: ${feedUrl}`);
    console.log("====================================");

    try {
      const { data: xml } = await axios.get(feedUrl, {
        timeout: 10000,
      });

      console.log(xml.slice(0, 5000));

      const items = parseRSS(xml);

      console.log(`Total Items: ${items.length}`);

      if (items.length === 0) {
        console.log("No items parsed");
        continue;
      }

      items.slice(0, 3).forEach((item, index) => {
        console.log(`\n----- ITEM ${index + 1} -----`);

        console.log("title:");
        console.log(item.title);

        console.log("\ndescription:");
        console.log(item.description);
      });

      const descriptionCount = items.filter(
        (item) => !!item.description,
      ).length;

      const authorCount = items.filter((item) => !!item.author).length;

      console.log("\n========== QUALITY ==========");

      console.log(`description: ${descriptionCount}/${items.length}`);

      console.log(`author: ${authorCount}/${items.length}`);
    } catch (error) {
      console.error(error);
    }
  }
}

run();
