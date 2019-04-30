import * as puppeteer from "puppeteer";

class SimplyHired {
  constructor(
    results: puppeteer.ElementHandle<Element>[] = [],
    url = "https://www.simplyhired.com/search?q=software+developer&fdb=30&pp=&job=JRM04OtDHCjzg0x7zZzy1l0yGf_LHNxfulInltgQXkPOEx0nA7El7Q",
    jobsSelector = "#content > div.wrap > div > div > div.tp-left.TwoPane-PaneHolder.LeftPaneHolder > div > div.jobs > div",
    selectedJobSelector = "#search > div:nth-child(23) > div > div.rpContent.ViewJob > div.viewjob-content > div:nth-child(1) > div > div.viewjob-description.ViewJob-description",
    page = 1
  ) {
    this.results = results;
    this.url = url;
    this.jobsSelector = jobsSelector;
    this.selectedJobSelector = selectedJobSelector;
    this.page = page;
  }

  private results: puppeteer.ElementHandle<Element>[];

  getResults(): puppeteer.ElementHandle<Element>[] {
    return this.results;
  }

  page: number;
  readonly url: string;
  readonly jobsSelector: string;
  readonly selectedJobSelector: string;

  async getInitialPage(url: string = this.url): Promise<void> {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      await this.scrapeJobInfo(page);
      browser.close();
    } catch (error) {
      console.error(error);
    }
  }

  async scrapeJobInfo(page: puppeteer.Page): Promise<void> {
    try {
      const jobs: puppeteer.ElementHandle<Element>[] = await page.$$(
        this.jobsSelector
      );
      for (let i = 0; i < jobs!.length; i++) {
        const selected: puppeteer.ElementHandle<Element> = jobs![i];
        const className = await selected.getProperty("className");
        // ***TODO: Could potentially make this check more durable***
        if (className._remoteObject.value !== "SalaryContentCard") {
          await selected.click();
          const selector = this.selectedJobSelector;
          await page.waitForFunction(
            selector => !!document.querySelector(selector),
            {},
            selector
          );
          const job: puppeteer.ElementHandle<Element> | null = await page.$(
            selector
          );
          console.log(!!job);
          if (job && this.determineRelevance(job)) this.results.push(job);
        }
      }
      this.generateNextPage();
    } catch (error) {
      console.error(error);
    }
  }

  async determineRelevance(
    job: puppeteer.ElementHandle<Element> | null
  ): Promise<boolean> {
    return false;
  }

  generateNextPage(): void {
    this.getInitialPage(
      `https://www.simplyhired.com/search?q=software+developer&amp;fdb=30&amp;pn=${++this
        .page}&amp;from=pagination&amp;pp=ABYAAAAAAAAAAAAAAAFglh9tAQEBCQO2TqjeeMs0pmLjOHwtkr6yHwI8LY35iFh4hGz6SDr4zyYBOtDDuSP8SRFkTrk9t1PI_w`
    );
  }
}

export default new SimplyHired();

// const scraper = new SimplyHired();
// const content = scraper.getInitialPage();

// console.log(content);

// const somethingSmellsLikeFart = async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   console.log("OH MY GOD MIA THATS DISGUSTING I CANT BREATHE!");
//   await page.goto("https://miafarted.com");
// };

// somethingSmellsLikeFart();
