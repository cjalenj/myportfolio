import React, { useEffect, useState, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import Fade from 'react-reveal';
import { Container, Badge } from 'react-bootstrap'; // Import Badge
import { ThemeContext } from 'styled-components'; // Import ThemeContext
import Header from './Header';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';

const styles = {
  iconStyle: {
    height: 75,
    width: 75,
    margin: 10,
    marginBottom: 0,
  },
  introTextContainer: {
    whiteSpace: 'pre-wrap',
  },
};

function Skills(props) {
  const { header } = props;
  const [data, setData] = useState(null);
  const theme = useContext(ThemeContext); // Get theme from context

  const renderSkillsIntro = (intro) => (
    <h4 style={styles.introTextContainer}>
      <ReactMarkdown children={intro} />
    </h4>
  );

  useEffect(() => {
    fetch(endpoints.skills, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  return (
    <>
      <Header title={header} />
      {data ? (
        <Fade>
          <div className="section-content-container">
            <Container style={{ paddingBottom: '100px' }}>
              {renderSkillsIntro(data.intro)}
              {data.skills?.map((rows) => (
                <div key={rows.title}>
                  <br />
                  <h3>{rows.title}</h3>
                  {typeof rows.items[0] === 'object' ? (
                    // Render icon-based skills
                    rows.items.map((item) => (
                      <div key={item.title} style={{ display: 'inline-block' }}>
                        <img style={styles.iconStyle} src={item.icon} alt={item.title} />
                        <p>{item.title}</p>
                      </div>
                    ))
                  ) : (
                    // Render text-based skills as badges
                    <div>
                      {rows.items.map((item) => (
                        <Badge
                          key={item}
                          pill
                          bg={theme.bsSecondaryVariant} // Use theme colors
                          text={theme.bsPrimaryVariant}
                          style={{
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingTop: 5,
                            paddingBottom: 5,
                            margin: 5,
                          }}
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </Container>
          </div>
        </Fade>
      ) : <FallbackSpinner />}
    </>
  );
}

Skills.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Skills;
