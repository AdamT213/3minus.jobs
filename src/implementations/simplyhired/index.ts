import { JSDOM } from "jsdom";
import { isHTMLElement } from "../../domutils";
import * as jsdomDevtoolsFormatter from "jsdom-devtools-formatter";

jsdomDevtoolsFormatter.install();

class SimplyHired {
  constructor(results: HTMLElement[] = []) {
    this.results = results;
  }

  results: HTMLElement[];

  async getInitialPage(): Promise<Document | undefined> {
    try {
      // ***TODO make sure this URL is universally relevant*** //
      const dom = await JSDOM.fromURL(
        "https://www.simplyhired.com/search?q=software+developer&fdb=30&pp=&job=JRM04OtDHCjzg0x7zZzy1l0yGf_LHNxfulInltgQXkPOEx0nA7El7Q",
        { runScripts: "dangerously" }
      );
      const document = dom.window.document;
      return document;
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
      for (let i = 0; i < jobs!.children.length; i++) {
        if (jobs!.children[i] && isHTMLElement(jobs!.children[i])) {
          const selected: HTMLElement = jobs!.children[i] as HTMLElement;
          await selected.click();
          // ***TODO right pane seems to be loaded separately from left pain. Will need to poll for presence of children in right pane somehow*** //
          const job: any = doc.querySelector(
            "#search > div:nth-child(23) > div > div.rpContent.ViewJob > div.viewjob-content > div:nth-child(1) > div > div.viewjob-description.ViewJob-description"
          );
          debugger;
          console.log(job);
          if (job && this.determineRelevance(job)) this.results.push(job);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async determineRelevance(job: HTMLElement | null): Promise<boolean> {
    return false;
  }
}

export default new SimplyHired();

const scraper = new SimplyHired();
const content = scraper.getInitialPage().then(content => {
  scraper.scrapeJobInfo(content!);
});

console.log(content);
