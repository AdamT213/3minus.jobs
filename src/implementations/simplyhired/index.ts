import * as puppeteer from "puppeteer";
import * as fs from "fs";
import JobDescription from "../../classifier/JobDescription";

// ***TODO*** Currently, all subsequent pages are leading back to first page

class SimplyHired {
  constructor(
    data: JobDescription[] = [],
    results: puppeteer.ElementHandle<Element>[] = [],
    url = "https://www.simplyhired.com/search?q=software+developer&fdb=30&pp=",
    jobsSelector = "#content > div.wrap > div > div > div.tp-left.TwoPane-PaneHolder.LeftPaneHolder > div > div.jobs > div",
    selectedJobSelector = "#search > div:nth-child(23) > div > div.rpContent.ViewJob > div.viewjob-content > div:nth-child(1) > div > div.viewjob-description.ViewJob-description",
    page = 1
  ) {
    this.data = data;
    this.results = results;
    this.url = url;
    this.jobsSelector = jobsSelector;
    this.selectedJobSelector = selectedJobSelector;
    this.page = page;
  }

  data: JobDescription[];

  private results: puppeteer.ElementHandle<Element>[];

  getResults(): puppeteer.ElementHandle<Element>[] {
    return this.results;
  }

  page: number;
  readonly url: string;
  readonly jobsSelector: string;
  readonly selectedJobSelector: string;

  async getPage(
    url: string = this.url,
    classifierTraining: Boolean = false
  ): Promise<void> {
    try {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(url);
      await this.scrapeJobInfo(page, classifierTraining);
      await browser.close();
      if (this.page < 4) {
        await this.getPage(
          `https://www.simplyhired.com/search?q=software+developer&fdb=30&pn=${++this
            .page}`,
          classifierTraining
        );
      } else {
        console.log(this.data);
        // await this.writeDataToFile();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async scrapeJobInfo(
    page: puppeteer.Page,
    classifierTraining: Boolean
  ): Promise<void> {
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
          if (classifierTraining) {
            if (job) await this.gatherData(page, job);
          } else {
            if (job && (await this.determineRelevance(job)))
              this.results.push(job);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async gatherData(
    page: puppeteer.Page,
    job: puppeteer.ElementHandle<Element> | null
  ): Promise<void> {
    const text = await page.evaluate(element => element.textContent, job);
    const datum: JobDescription = new JobDescription(text);
    this.data.push(datum);
  }

  async writeDataToFile(): Promise<void> {
    await fs.writeFile(
      __dirname + "/../../classifier/data.json",
      JSON.stringify(this.data),
      err => {
        if (err) throw err;
        console.log("The file has been saved!");
      }
    );
  }

  async determineRelevance(
    job: puppeteer.ElementHandle<Element> | null
  ): Promise<boolean> {
    return false;
  }
}

export default new SimplyHired();

async function testLocally() {
  const scraper = new SimplyHired();
  await scraper.getPage(scraper.url, true);
}
console.log(testLocally());
