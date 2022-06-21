import { TEST_POAP_EVENTS } from "cypress/config";

describe("Event Tokens", () => {
  it("GET", () => {
    TEST_POAP_EVENTS.forEach(eventId => {
      return cy
        .request({
          method: "GET",
          url: `/api/poap/event/tokens/${eventId}?limit=3&offset=3&total=3`,
        })
        .should(response => {
          expect(response.status).to.eq(200);
        });
    });
  });
});
