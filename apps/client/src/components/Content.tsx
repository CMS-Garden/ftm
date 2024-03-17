import { HTMLProps, forwardRef } from 'react';
import { useContent } from '../lib/data/useContent';

export const Content = forwardRef<
  HTMLParagraphElement,
  { id: string } & Omit<HTMLProps<HTMLParagraphElement>, 'children'>
>(({ id, ...props }, ref) => {
  const lang = ['en-US', 'de-DE'].includes(navigator.language)
    ? navigator.language
    : 'en-US';
  const content = useContent(id, lang);
  return (
    <p dangerouslySetInnerHTML={{ __html: content }} ref={ref} {...props} />
  );
});
