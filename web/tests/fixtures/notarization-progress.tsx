import { createRoot } from 'react-dom/client';
import { NotarizationProgress } from '../../components/NotarizationProgress';

createRoot(document.querySelector('#root')!).render(
  <NotarizationProgress
    initialPercent={9}
    targetUSD={99}
    targetAmount="$99"
    raisedLabel="Funded via Ko-fi"
    targetLabel="First-year goal"
    progressTemplate="{percent}% of the goal funded"
    title="Help DeskUtils get notarized."
  />,
);
