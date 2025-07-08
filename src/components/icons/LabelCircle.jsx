import React from 'react';

export default function LabelCircle({ color = '#bdbdbd', size = 12, title = '' }) {
  return (
    <span
      className="inline-block align-middle"
      title={title}
      style={{ width: size, height: size }}
    >
      <span
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          borderRadius: '50%',
          background: color,
          border: '1px solid #ccc',
        }}
      />
    </span>
  );
}
