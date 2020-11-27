
export const Instockvalue = ({ children }) => {
  switch (children.props.children) {
    case 'INSTOCK':
      return 'Instock';
    case 'LESSTHAN10':
      return ' Less than 10';
    case 'OUTOFSTOCK':
      return 'Out of stock';
    default:
      return children;
  }
};

export const Availability = ({ children }) => children;