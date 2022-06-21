export {};

describe("Stats", () => {
  it("GET", () => {
    cy.request({
      method: "GET",
      url: "/api/stats",
    }).should(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("dbsize");
      expect(response.body).to.have.property("apiKeys");
      expect(response.body).to.have.property("ipRules");
      expect(response.body).to.have.property("tinTin");
      expect(response.body).to.have.property("fourByte");
    });
  });
});
