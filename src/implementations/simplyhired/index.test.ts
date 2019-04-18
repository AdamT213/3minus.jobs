import SimplyHired from './index';

it('scrapes a valid and current URL', async() => { 
    const testContent = await SimplyHired.getInitialPage();
    expect(testContent).toBeDefined();
});
// it('returns a list of jobs', () => { 
//     const jobs = SimplyHired.scrapeJobInfo(testContent!);
//     expect(jobs.length).toBeGreaterThan(10);
// });
