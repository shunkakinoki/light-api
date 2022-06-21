import { TEST_ADDRESS } from "cypress/config";

describe("Network", () => {
  it("GET", () => {
    TEST_ADDRESS.forEach(address => {
      return cy
        .request({
          method: "GET",
          url: `/api/network/${address}`,
        })
        .should(response => {
          expect(response.status).to.eq(200);
        });
    });
  });
});
