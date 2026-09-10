import React from 'react';
import { createRoot } from 'react-dom/client';
import { DemoMedia } from '../../components/DemoMedia';
import type { Demo } from '../../content/product';
const demo = JSON.parse(document.querySelector('#demo-data')!.textContent!) as Demo;
createRoot(document.querySelector('#root')!).render(<DemoMedia demo={demo} />);
