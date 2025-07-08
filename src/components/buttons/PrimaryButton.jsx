import React from 'react';
import { BaseButton } from './BaseButton';

const PRIMARY_CLASS = 'bg-indigo-600 text-white hover:bg-indigo-700';

export class PrimaryButton extends React.Component {
  render() {
    const { className = '', ...props } = this.props;
    return (
      <BaseButton
        {...props}
        className={`${PRIMARY_CLASS} ${className}`.trim()}
      >
        {this.props.children}
      </BaseButton>
    );
  }
}

export default PrimaryButton;
