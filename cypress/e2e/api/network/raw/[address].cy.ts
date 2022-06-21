import { TEST_ADDRESS } from "cypress/config";

describe("Raw Network", () => {
  it("GET", () => {
    TEST_ADDRESS.forEach(address => {
      return cy
        .request({
          method: "GET",
          url: `/api/network/raw/${address}`,
        })
        .should(response => {
          expect(response.status).to.eq(200);
        });
    });
  });
});
