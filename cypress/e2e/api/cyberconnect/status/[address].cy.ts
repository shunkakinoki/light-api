import { TEST_ADDRESS } from "cypress/config";

describe("Ranking", () => {
  it("GET", () => {
    cy.request({
      method: "GET",
      url: `/api/cyberconnect/status/${TEST_ADDRESS[0]}?to=${TEST_ADDRESS[1]}`,
    }).should(response => {
      expect(response.status).to.eq(200);
    });
  });
});
