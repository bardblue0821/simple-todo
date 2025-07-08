import React from 'react';
import { BaseButton } from './BaseButton';

const SECONDARY_CLASS = 'bg-gray-200 text-black hover:bg-gray-300';

export class SecondaryButton extends React.Component {
  render() {
    const { className = '', ...props } = this.props;
    return (
      <BaseButton
        {...props}
        className={`${SECONDARY_CLASS} ${className}`.trim()}
      >
        {this.props.children}
      </BaseButton>
    );
  }
}

export default SecondaryButton;
