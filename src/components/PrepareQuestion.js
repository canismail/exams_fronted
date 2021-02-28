import React from 'react';
import PropTypes from 'prop-types';

function PrepareQuestion(props) {
  return <form>
    <p>Enter Question:</p>
    <input
      type="text"
    />
  </form>;
}

PrepareQuestion.propTypes = {
  content: PropTypes.string.isRequired
};

export default PrepareQuestion;
