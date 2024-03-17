import { HTMLProps, forwardRef } from 'react';
import { useContent } from '../lib/data/useContent';

export const Content = forwardRef<
  HTMLParagraphElement,
  { id: string } & Omit<HTMLProps<HTMLParagraphElement>, 'children'>
>(({ id, ...props }, ref) => {
  const content = useContent(id);
  return (
    <div dangerouslySetInnerHTML={{ __html: content }} ref={ref} {...props} />
  );
});
