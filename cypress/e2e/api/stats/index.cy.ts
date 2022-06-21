export {};

describe("Stats", () => {
  it("GET", () => {
    cy.request({
      method: "GET",
      url: "/api/stats",
    }).should(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("users");
    });
  });
});
