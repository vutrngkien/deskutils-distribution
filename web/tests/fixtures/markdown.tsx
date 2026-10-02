import React from 'react';
import { createRoot } from 'react-dom/client';
import { Markdown } from '../../components/Markdown';

const text = JSON.parse(document.querySelector('#md-data')!.textContent ?? '""') as string;
createRoot(document.querySelector('#root')!).render(<Markdown text={text} />);
