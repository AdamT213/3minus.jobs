import SimplyHired from "./index";

jest.setTimeout(10000);

it("scrapes a valid and current URL", async () => {
  await expect(page.goto(SimplyHired.url)).resolves.not.toThrow();
});
