import React from 'react';
import { Link } from '../../helpers';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';

const propTypes = {
  displayMenu: PropTypes.bool
};

function NavLinks({ displayMenu }) {
  return (
    <div className='main-nav-group'>
      <ul
        className={'nav-list' + (displayMenu ? ' display-flex' : '')}
        role='menu'
      >
        <li className='nav-news' role='menuitem'>
          <Link external={true} to='/news'>
            <FormattedMessage id='/news' />
          </Link>
        </li>
        <li className='nav-forum' role='menuitem'>
          <Link external={true} to='/forum'>
            <FormattedMessage id='/forum' />
          </Link>
        </li>
        <li className='nav-projects' role='menuitem'>
          <Link to='/learn'>
            <FormattedMessage id='/learn' />
          </Link>
        </li>
      </ul>
    </div>
  );
}

NavLinks.propTypes = propTypes;
NavLinks.displayName = 'NavLinks';
export default NavLinks;
