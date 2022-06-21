import { TEST_SNAPSHOT_SPACES } from "cypress/config";

describe("Space", () => {
  it("GET", () => {
    TEST_SNAPSHOT_SPACES.forEach(spaceId => {
      return cy
        .request({
          method: "GET",
          url: `/api/snapshot/space/${spaceId}`,
        })
        .should(response => {
          expect(response.status).to.eq(200);
        });
    });
  });
});
