export {};

describe("Ranking", () => {
  it("GET", () => {
    cy.request({
      method: "GET",
      url: `/api/cyberconnect/rankings`,
    }).should(response => {
      expect(response.status).to.eq(200);
    });
  });
});
