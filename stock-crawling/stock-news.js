import axios from "axios";
import * as cheerio from "cheerio";
import iconv from "iconv-lite";

const url =
  "https://finance.naver.com/item/news_notice.naver?code=005930&page=";

async function main() {
  const resp = await axios.get(url, { responseType: "arraybuffer" });
  const html = iconv.decode(resp.data, "EUC-KR");
  const $ = cheerio.load(html);

  const disclosureList = $("tbody.first tr, tbody.last tr");
  const disclosures = disclosureList
    .map((i, el) => {
      return corpDisclosure($(el));
    })
    .get();

  console.log(disclosures);
}

function corpDisclosure(elem) {
  const title = elem.find(".title .tit").text().trim();
  const info = elem.find(".info").text();
  const date = elem.find(".date").text();
  return {
    title,
    info,
    date,
  };
}

main();
