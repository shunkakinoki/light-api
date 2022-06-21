import { TEST_ADDRESS } from "cypress/config";

describe("Followings", () => {
  it("GET", () => {
    TEST_ADDRESS.forEach(address => {
      return cy
        .request({
          method: "GET",
          url: `/api/cyberconnect/followings/${address}`,
        })
        .should(response => {
          expect(response.status).to.eq(200);
        });
    });
  });
});
