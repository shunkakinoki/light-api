import { TEST_NFT_ADDRESS } from "cypress/config";

describe("Opensea Asset", () => {
  it("GET", () => {
    TEST_NFT_ADDRESS.forEach(address => {
      return cy
        .request({
          method: "GET",
          url: `/api/opensea/asset/${address[0]}/${address[1]}`,
        })
        .should(response => {
          expect(response.status).to.eq(200);
        });
    });
  });
});
