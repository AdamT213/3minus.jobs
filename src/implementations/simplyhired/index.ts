import { JSDOM } from 'jsdom';

export default class SimplyHired { 
    async scrape(): void {
        try {
          // ***TODO check if this URL is universally relevant***
          const dom = await JSDOM.fromURL('https://www.simplyhired.com/search?q=software+developer&fdb=30&pp=&job=JRM04OtDHCjzg0x7zZzy1l0yGf_LHNxfulInltgQXkPOEx0nA7El7Q');
          const document = dom.window.document;
          const jobs = document.querySelector('#content > div.wrap > div > div > div.tp-left.TwoPane-PaneHolder.LeftPaneHolder > div > div.jobs');
          for (let i=0; i<jobs!.children.length; i++) {
            console.log(jobs!.children[i]);
          }
        } catch (error) {
          console.error(error);
        }
      }
}

new SimplyHired().scrape();