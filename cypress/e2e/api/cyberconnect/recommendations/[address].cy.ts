import { TEST_ADDRESS } from "cypress/config";

describe("Recommendations", () => {
  it("GET", () => {
    TEST_ADDRESS.forEach(address => {
      return cy
        .request({
          method: "GET",
          url: `/api/cyberconnect/recommendations/${address}`,
        })
        .should(response => {
          expect(response.status).to.eq(200);
        });
    });
  });
});
