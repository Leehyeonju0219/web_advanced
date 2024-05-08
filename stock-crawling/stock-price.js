import axios from "axios";
import * as cheerio from "cheerio";
import iconv from "iconv-lite";

const url = "https://finance.naver.com/item/sise.nhn?code=005930";

const response = await axios.get(url, { responseType: "arraybuffer" });
const html = iconv.decode(response.data, "EUC-KR");
const $ = cheerio.load(html);

const dayPricesUrl =
  "https://finance.naver.com" + $("iframe[name=day]").eq(1).prop("src");

console.log(dayPricesUrl);

const config = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  },
  responseType: "arraybuffer",
};
const resp = await axios.get(dayPricesUrl, config);
const data = iconv.decode(resp.data, "EUC-KR");
const $$ = cheerio.load(data);
const siseList = $$(".type2 tr[onmouseover]");

const siseParsed = siseList
  .map((i, el) => {
    return parseSise($(el));
  })
  .get();
console.log(siseParsed);

function parseSise(newsElem) {
  const date = newsElem.find("td span.tah.p10.gray03").text();
  const closingPrice = newsElem.find(".num .tah.p11").eq(0).text();
  const upOrDown = newsElem.find(".num .bu_p .blind").text();
  const compare = newsElem.find(".num .tah.p11").eq(1).text().trim();
  const marketPrice = newsElem.find(".num .tah.p11").eq(2).text();
  const highPrice = newsElem.find(".num .tah.p11").eq(3).text();
  const lowPrice = newsElem.find(".num .tah.p11").eq(4).text();
  const amount = newsElem.find(".num .tah.p11").eq(5).text();
  return {
    date,
    closingPrice,
    upOrDown,
    compare,
    marketPrice,
    highPrice,
    lowPrice,
    amount,
  };
}
