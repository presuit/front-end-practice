import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { ValidationCode } from "../pages/ValidateCode";

export const LoggedInRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/validate-code">
          <ValidationCode />
        </Route>
        <Route path="/me">
          <Home />
        </Route>
        <Route path="/users/:id" exact>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
};
