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

test("Add a request to the overview page", () => {
  const component = renderer.create(<OverviewPage />);

  let page = component.toJSON();
  expect(page).toMatchSnapshot();

  page.props.addRequest({
    name: "Ludwig Schubert",
    requests: ["View your comic collection", "Eat your food"]
  });
  page = component.toJSON();
  expect(page).toMatchSnapshot();
});

test("Remove a request from the overview page", () => {
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

  page.props.removeRequest(0);
  page = component.toJSON();
  expect(page).toMatchSnapshot();

  page.props.removeRequest({
    name: "Malte Sielski",
    requests: ["View your phone number", "Edit your Birthdate"]
  });
  page = component.toJSON();
  expect(page).toMatchSnapshot();
});
