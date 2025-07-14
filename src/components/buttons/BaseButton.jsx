import React from 'react';

export class BaseButton extends React.Component {
  render() {
    const {
      as: Component = 'button',
      children,
      className = '',
      ...props
    } = this.props;
    return (
      <Component
        className={`rounded font-bold cursor-pointer transition-colors px-4 py-2 ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
}
