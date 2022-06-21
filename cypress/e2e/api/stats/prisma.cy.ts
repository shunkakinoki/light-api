export {};

describe("Stats", () => {
  it("GET", () => {
    cy.request({
      method: "GET",
      url: "/api/stats/prisma",
    }).should(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("users");
      expect(response.body).to.have.property("activity");
      expect(response.body).to.have.property("address");
    });
  });
});
