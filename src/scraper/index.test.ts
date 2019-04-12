import  Scraper  from './index';

it ('should do nothing at all', () => { 
    expect(Scraper.scrape()).toThrow();
});