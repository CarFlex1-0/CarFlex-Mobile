import React from 'react';
import { Button } from 'tamagui';

export const CustomButton = ({ children, ...props }) => {
  return (
    <Button
      size="$4"
      theme="blue"
      {...props}
    >
      {children}
    </Button>
  );
}; 