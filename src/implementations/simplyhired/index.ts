import * as puppeteer from "puppeteer";

class SimplyHired {
  constructor(results: puppeteer.ElementHandle<Element>[] = []) {
    this.results = results;
  }

  results: puppeteer.ElementHandle<Element>[];

  async getInitialPage(url: string): Promise<void> {
    try {
      const browser = await puppeteer.launch({
        headless: false
      });
      const page = await browser.newPage();
      await page.goto(url);
      const jobs: puppeteer.ElementHandle<Element>[] = await page.$$(
        "#content > div.wrap > div > div > div.tp-left.TwoPane-PaneHolder.LeftPaneHolder > div > div.jobs > div"
      );
      for (let i = 0; i < jobs!.length; i++) {
        const selected: puppeteer.ElementHandle<Element> = jobs![i];
        const className = await selected.getProperty("className");
        // ***TODO: Could potentially make this check more durable***
        if (className._remoteObject.value !== "SalaryContentCard") {
          await selected.click();
          const selector =
            "#search > div:nth-child(23) > div > div.rpContent.ViewJob > div.viewjob-content > div:nth-child(1) > div > div.viewjob-description.ViewJob-description";
          await page.waitForFunction(
            selector => !!document.querySelector(selector),
            {},
            selector
          );
          const job: puppeteer.ElementHandle<Element> | null = await page.$(
            "#search > div:nth-child(23) > div > div.rpContent.ViewJob > div.viewjob-content > div:nth-child(1) > div > div.viewjob-description.ViewJob-description"
          );
          console.log(!!job);
          if (job && this.determineRelevance(job)) this.results.push(job);
        }
      }
      browser.close();
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async scrapeJobInfo(doc: Document): Promise<void> {
    try {
      const jobs: HTMLElement | null = doc.querySelector(
        "#content > div.wrap > div > div > div.tp-left.TwoPane-PaneHolder.LeftPaneHolder > div > div.jobs"
      );
      debugger;
      for (let i = 0; i < jobs!.children.length; i++) {
        if (jobs!.children[i] && isHTMLElement(jobs!.children[i])) {
          const selected: HTMLElement = jobs!.children[i] as HTMLElement;
          await selected.click();
          const job: HTMLElement | null = doc.querySelector(
            "#search > div:nth-child(23) > div > div.rpContent.ViewJob > div.viewjob-content > div:nth-child(1) > div > div.viewjob-description.ViewJob-description"
          );
          console.log(job);
          if (job && this.determineRelevance(job)) this.results.push(job);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async determineRelevance(
    job: puppeteer.ElementHandle<Element> | null
  ): Promise<boolean> {
    return false;
  }
}

export default new SimplyHired();

const scraper = new SimplyHired();
const content = scraper.getInitialPage(
  "https://www.simplyhired.com/search?q=software+developer&fdb=30&pp=&job=JRM04OtDHCjzg0x7zZzy1l0yGf_LHNxfulInltgQXkPOEx0nA7El7Q"
);

console.log(content);
