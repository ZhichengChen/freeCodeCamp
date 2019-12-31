import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Link, Spacer, Loader, FullWidthRow } from '../helpers';
import { Row, Col } from '@freecodecamp/react-bootstrap';
import { apiLocation } from '../../../config/env.json';
import { randomQuote } from '../../utils/get-words';

import './intro.css';

const propTypes = {
  complete: PropTypes.bool,
  intl: intlShape.isRequired,
  isSignedIn: PropTypes.bool,
  name: PropTypes.string,
  navigate: PropTypes.func,
  pending: PropTypes.bool,
  slug: PropTypes.string,
  username: PropTypes.string
};

function Intro({
  isSignedIn,
  username,
  name,
  navigate,
  pending,
  complete,
  slug,
  intl
}) {
  if (pending && !complete) {
    return (
      <>
        <Spacer />
        <Loader />
        <Spacer />
      </>
    );
  } else if (isSignedIn) {
    const { quote, author } = randomQuote(intl.locale);
    return (
      <>
        <Row>
          <Col sm={10} smOffset={1} xs={12}>
            <Spacer />
            <h1 className='text-center big-heading'>
              {name
                ? intl.formatMessage({ id: 'Welcome back, ' }) +
                  name +
                  intl.formatMessage({ id: '.' })
                : intl.formatMessage({ id: 'Welcome to freeCodeCamp.org' })}
            </h1>
            <Spacer />
          </Col>

          <FullWidthRow className='button-group'>
            <Link
              className='btn btn-lg btn-primary btn-block'
              to={`/${username}`}
            >
              <FormattedMessage id='View my Portfolio' />
            </Link>
            <Link className='btn btn-lg btn-primary btn-block' to='/settings'>
              <FormattedMessage id='Update my account settings' />
            </Link>
          </FullWidthRow>
        </Row>
        <Spacer />
        <Row className='text-center quote-partial'>
          <Col sm={10} smOffset={1} xs={12}>
            <blockquote className='blockquote'>
              <span>
                <q>{quote}</q>
                <footer className='quote-author blockquote-footer'>
                  <cite>{author}</cite>
                </footer>
              </span>
            </blockquote>
          </Col>
        </Row>
        <Row>
          <Col sm={10} smOffset={1} xs={12}>
            <Spacer />
            <h4>
              <FormattedMessage
                id='If you are new to coding, we recommend 
                you'
              />
              <Link to={slug}>
                <FormattedMessage id='start at the beginning' />
              </Link>
              <FormattedMessage id='.' />
            </h4>
          </Col>
        </Row>
      </>
    );
  } else {
    return (
      <>
        <Row>
          <Col sm={10} smOffset={1} xs={12}>
            <Spacer />
            <h1 className='big-heading text-center'>
              <FormattedMessage id='Welcome to freeCodeCamp.org' />
            </h1>
            <Spacer />
            <h2 className='medium-heading'>
              <FormattedMessage id='Learn to code.' />
            </h2>
            <h2 className='medium-heading'>
              <FormattedMessage id='Build projects.' />
            </h2>
            <h2 className='medium-heading'>
              <FormattedMessage id='Earn certifications.' />
            </h2>
            <h2 className='medium-heading'>
              <FormattedMessage
                id='Since 2014, more than 40,000 freeCodeCamp.org graduates have
                gotten jobs at tech companies including:'
              />
            </h2>
            <div className='logo-row'>
              <h2 className='medium-heading'>
                <FormattedMessage id='Apple' />
              </h2>
              <h2 className='medium-heading'>
                <FormattedMessage id='Google' />
              </h2>
              <h2 className='medium-heading'>
                <FormattedMessage id='Amazon' />
              </h2>
              <h2 className='medium-heading'>
                <FormattedMessage id='Microsoft' />
              </h2>
              <h2 className='medium-heading'>Spotify</h2>
            </div>
          </Col>
          <Col sm={10} smOffset={1} xs={12}>
            <button
              className={'btn-cta-big signup-btn btn-cta center-block'}
              onClick={() => {
                navigate(`${apiLocation}/signin`);
              }}
            >
              <FormattedMessage
                id="Sign in to save your progress 
                (it's free)"
              />
            </button>
          </Col>
        </Row>
        <Spacer />
      </>
    );
  }
}

Intro.propTypes = propTypes;
Intro.displayName = 'Intro';

export default injectIntl(Intro);
