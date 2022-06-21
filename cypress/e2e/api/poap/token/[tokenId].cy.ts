import { TEST_POAP_TOKENS } from "cypress/config";

describe("Token", () => {
  it("GET", () => {
    TEST_POAP_TOKENS.forEach(tokenId => {
      return cy
        .request({
          method: "GET",
          url: `/api/poap/token/${tokenId}`,
        })
        .should(response => {
          expect(response.status).to.eq(200);
        });
    });
  });
});
