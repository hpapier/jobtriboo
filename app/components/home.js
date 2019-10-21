import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'

import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import { Card, CardContent, Button } from '@material-ui/core'

const Triboo = ({ selected, switchTriboo, triboo = []}) => {
  const triboos = triboo.map((item, index) => <ToggleButton key={index} value={item}>{item}</ToggleButton>);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: 20 }}>
      <ToggleButtonGroup
        exclusive={true}
        onChange={(e, value) => (value !== null) ? switchTriboo(value) : null}
        size="large"
        value={selected}
      >
        {triboos}
      </ToggleButtonGroup>
    </div>
  );
}

const SampleData = ({ selected, data = []}) => {
  const sample = data
                  .filter((item) => (item.triboo === selected))
                  .map((item, index) => (
                    <Card key={index} raised={true} style={{ width: 500, margin: 10 }}>
                      <CardContent>
                        <h2>{item.title}</h2>
                        <h5>{selected}</h5>
                        <p>{item.body}</p>
                      </CardContent>
                    </Card>
                  ));

  const sampleBox = {
    display: 'flex',
    flexWrap: 'wrap',
    width: 1050,
    margin: 'auto'
  };

  return (
    <div style={sampleBox}>
      {sample}
    </div>
  );
}

const Home = ({ data }) => {
  const [tribooSelected, setTribooSelected] = useState('commercial');
  const router = useRouter();
  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: 50 }}>Join your triboo.</h1>
      <Triboo selected={tribooSelected} switchTriboo={setTribooSelected} triboo={data.triboo} />
      <SampleData selected={tribooSelected} data={data.sample} />
      <Button onClick={() => router.push('/jobs')} variant="outlined" style={{ margin: 'auto', display: 'block', marginTop: 15 }}>See more</Button>
    </div>
);
}
export default Home;