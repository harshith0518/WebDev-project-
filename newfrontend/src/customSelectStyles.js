
const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: '#1f2937',
    color: '#fff',
    borderColor: state.isFocused ? '#eab308' : '#4b5563',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#eab308',
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#1f2937',
    color: '#fff',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#374151' : '#1f2937',
    color: 'white',
    cursor: 'pointer',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#374151',
    color: 'white',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'white',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#f87171',
    ':hover': {
      backgroundColor: '#dc2626',
      color: 'white',
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: '#9ca3af',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'white',
  }),
};


export default customSelectStyles;
