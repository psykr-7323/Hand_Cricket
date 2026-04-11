import React from 'react';
import { motion } from 'framer-motion';

const GRID_CLASS = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

const SPAN_CLASS = {
  1: '',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
};

const buildRows = (options) => {
  if (options.length === 7) {
    return [
      {
        columns: 4,
        items: options.slice(0, 4).map((value) => ({ value, span: 1 })),
      },
      {
        columns: 4,
        items: [
          { value: options[4], span: 1 },
          { value: options[5], span: 2 },
          { value: options[6], span: 1 },
        ],
      },
    ];
  }

  if (options.length === 6) {
    return [
      {
        columns: 3,
        items: options.slice(0, 3).map((value) => ({ value, span: 1 })),
      },
      {
        columns: 3,
        items: options.slice(3).map((value) => ({ value, span: 1 })),
      },
    ];
  }

  const midpoint = Math.ceil(options.length / 2);
  return [
    {
      columns: midpoint,
      items: options.slice(0, midpoint).map((value) => ({ value, span: 1 })),
    },
    {
      columns: Math.max(1, options.length - midpoint),
      items: options.slice(midpoint).map((value) => ({ value, span: 1 })),
    },
  ];
};

function NumberPad({
  options,
  onSelect,
  disabled = false,
  className = '',
  buttonClassName = '',
}) {
  const rows = buildRows(options);

  return (
    <div className={`${disabled ? 'pointer-events-none opacity-40' : ''} ${className}`.trim()}>
      <div className="space-y-3">
        {rows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`grid gap-3 ${GRID_CLASS[row.columns] || 'grid-cols-1'}`}
          >
            {row.items.map((item) => (
              <motion.button
                key={item.value}
                whileTap={{ scale: 0.94 }}
                onClick={() => onSelect(item.value)}
                className={`num-pad-btn w-full ${SPAN_CLASS[item.span] || ''} ${buttonClassName}`.trim()}
              >
                {item.value}
              </motion.button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NumberPad;
