import React from 'react';
import { Grid, Image } from 'semantic-ui-react';

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
class Landing extends React.Component {
  render() {
    return (
        <Grid verticalAlign='middle' textAlign='center' container>

          <Grid.Column width={12}>
            <Image src="/images/HACC-Logo.png" size='massive'/>
          </Grid.Column>

          <Grid.Column width={8}>
            <h1>Welcome to HACC 2020</h1>
			<h3>About the HACC</h3>
            <p>In 2015, Gov. David Ige conceived the idea of a hackathon that encouraged civic engagement with the local technology community in modernizing state functions and services for a more effective, efficient and open government. Another objective of the hackathon was to strengthen the pipeline of the IT workforce and expand the tech industry in our State. </p>
			<p>What makes the Hawaii Annual Code Challenge (HACC) unique is that it breaks the mold of a traditional hackathon, which typically takes place over a single day or weekend. The HACC provides an expanded multi-week timeframe meant to encourage interaction between community teams and state department personnel, ultimately resulting in sustainable solutions that are appropriately matched with technologies and platforms in use or being considered by the state. Beginning at the HACC Kick Off, community participants form teams and select from a list of challenges. </p>
			<p>The HACC generates proof-of-concepts by student, amateur and professional coders to benefit community and State agencies to support sustainability at the idea-phase level, feeding into Hawai’i’s vibrant innovation ecosystem to promote solutions for the state, community, professional development, local job creation and building local businesses.</p>
            <p>HACC is nationally recognized with the State IT Innovation of the Year award by StateScoop, the leading government IT media company in the nation’s capital.</p>
          </Grid.Column>

        </Grid>
    );
  }
}

export default Landing;
