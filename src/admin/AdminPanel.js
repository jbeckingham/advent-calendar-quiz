import React from "react";
import { Grid } from "semantic-ui-react";
import Snowflakes from "magic-snowflakes";
import ChangePassword from "./ChangePassword";
import Players from "./Players";
import Configure from "./Configure";
import Instructions from "./Instructions";
import ViewAnswers from "./ViewAnswers";

const snowflakes = new Snowflakes({ color: "white", speed: 2 });
snowflakes.start();

const AdminPanel = ({ id, password, onPasswordUpdateSuccess }) => {
  return (
    <div className="admin-panel">
      <Grid
        textAlign="center"
        style={{ height: "calc(100vh - 190px)" }}
        verticalAlign="middle"
        columns={1}
      >
        <Grid.Column key={0}>
          <Grid.Row>
            <ChangePassword
              id={id}
              password={password}
              onPasswordUpdateSuccess={onPasswordUpdateSuccess}
            />
          </Grid.Row>
          <Grid.Row>
            <Players id={id} password={password} />
          </Grid.Row>
          <Grid.Row>
            <Instructions />
          </Grid.Row>
          <Grid.Row>
            <Configure id={id} password={password} />
          </Grid.Row>
          <Grid.Row>
            <ViewAnswers id={id} />
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default AdminPanel;
