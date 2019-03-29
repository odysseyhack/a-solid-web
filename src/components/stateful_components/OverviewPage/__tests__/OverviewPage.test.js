import React from "react";
import OverviewPage from "../OverviewPage";
import renderer from "react-test-renderer";

test("Request cards are displayed properly", () => {
  const component = renderer.create(
    <OverviewPage
      requests={Array(12).fill({
        name: "Malte Sielski",
        requests: ["View your phone number", "Edit your Birthdate"]
      })}
    />
  );

  let page = component.toJSON();
  expect(page).toMatchSnapshot();
});
