import { HTMLProps, forwardRef } from 'react';
import { useContent } from '../lib/data/useContent';
import styles from './content.module.css';

export const Content = forwardRef<
  HTMLParagraphElement,
  { slug: string } & Omit<HTMLProps<HTMLParagraphElement>, 'children'>
>(({ slug, ...props }, ref) => {
  // const lang = ['en-US', 'de-DE'].includes(navigator.language)
  //   ? navigator.language
  //   : 'en-US';
  const lang = 'en-US';
  const content = useContent(slug, lang);
  return (

    <div
      className={styles.text}
      dangerouslySetInnerHTML={{ __html: content }}
      ref={ref}
      {...props}
    />
  );
});
