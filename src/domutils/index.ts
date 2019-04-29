import * as puppeteer from "puppeteer";

export const isHTMLElement = (o: any) => {
  return typeof HTMLElement === "object"
    ? o instanceof HTMLElement //DOM2
    : o &&
        typeof o === "object" &&
        o !== null &&
        o.nodeType === 1 &&
        typeof o.nodeName === "string";
};

export const elementOnPage = async (
  page: puppeteer.Page,
  query: string,
  timeout: number = 10000
): Promise<Boolean | undefined> => {
  return new Promise(resolve => {
    const startTime = Date.now();
    const tryQuery = () => {
      const elem = page.$(query);
      if (elem) resolve(true);
      else if (Date.now() - startTime > timeout) resolve(false);
      else setTimeout(tryQuery, 10);
    };
    tryQuery();
  });
};
