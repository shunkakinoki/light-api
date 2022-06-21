import { TEST_POAP_EVENTS } from "cypress/config";

describe("Event", () => {
  it("GET", () => {
    TEST_POAP_EVENTS.forEach(eventId => {
      return cy
        .request({
          method: "GET",
          url: `/api/poap/event/${eventId}`,
        })
        .should(response => {
          expect(response.status).to.eq(200);
        });
    });
  });
});
