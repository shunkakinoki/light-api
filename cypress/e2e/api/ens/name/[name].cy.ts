import { TEST_ENS } from "cypress/config";

describe("ENS Name", () => {
  it("GET", () => {
    TEST_ENS.forEach(address => {
      return cy
        .request({
          method: "GET",
          url: `/api/ens/name/${address}`,
        })
        .should(response => {
          expect(response.status).to.eq(200);
        });
    });
  });
});
