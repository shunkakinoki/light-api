import { TEST_ADDRESS } from "cypress/config";

describe("Graph", () => {
  it("GET", () => {
    TEST_ADDRESS.forEach(address => {
      return cy
        .request({
          method: "GET",
          url: `/api/poap/graph/${address}`,
        })
        .should(response => {
          expect(response.status).to.eq(200);
        });
    });
  });
});
