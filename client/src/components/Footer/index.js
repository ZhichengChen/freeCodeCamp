import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import Link from '../helpers/Link';
import FooterCol from './FooterCol';

import { footerLinks } from './footerLinks';
import './footer.css';

const propTypes = {
  children: PropTypes.any,
  intl: intlShape.isRequired
};

const ColHeader = ({ children, ...other }) => (
  <div className='col-header' {...other}>
    {children}
  </div>
);
ColHeader.propTypes = propTypes;

Footer.propTypes = {
  intl: intlShape.isRequired
};

function Footer({ intl }) {
  return (
    <footer className='site-footer'>
      <div className='footer-container'>
        <div className='footer-row'>
          <div className='footer-desc-col'>
            <p>
              <FormattedMessage
                id='freeCodeCamp is a donor-supported tax-exempt 501(c)(3) 
                  nonprofit organization (United States Federal Tax 
                  Identification Number: 82-0779546)'
              />
            </p>
            <p>
              <FormattedMessage
                id='Our mission: to help people learn to code for free. We 
                  accomplish this by creating thousands of videos, articles, 
                  and interactive coding lessons - all freely available to 
                  the public. We also have thousands of freeCodeCamp study 
                  groups around the world.'
              />
            </p>
            <p>
              <FormattedMessage
                id='Donations to freeCodeCamp go toward our education 
                  initiatives, and help pay for servers, services, and 
                  staff.'
              />
            </p>
            <p className='footer-donation'>
              <FormattedMessage id='You can' />
              <Link className='inline' to='/donate'>
                <FormattedMessage id='make a tax-deductible donation here' />
              </Link>
              <FormattedMessage id='.' />
            </p>
          </div>
          {footerLinks[intl.locale].map(({ title, links }, index) => (
            <FooterCol
              key={`footer-col-${index}`}
              links={links}
              title={title}
            />
          ))}
        </div>
      </div>
    </footer>
  );
}

Footer.displayName = 'Footer';
export default injectIntl(Footer);
