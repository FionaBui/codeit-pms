import { Button as AntButton } from 'antd';

export function Button({ children, ...props }) {
  return <AntButton {...props}>{children}</AntButton>;
}

export default Button;
