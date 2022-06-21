import { TEST_SNAPSHOT_SPACES } from "cypress/config";

describe("Voters", () => {
  it("GET", () => {
    TEST_SNAPSHOT_SPACES.forEach(spaceId => {
      return cy
        .request({
          method: "GET",
          url: `/api/snapshot/voters/${spaceId}`,
        })
        .should(response => {
          expect(response.status).to.eq(200);
        });
    });
  });
});
