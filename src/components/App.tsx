import { createRoot } from 'react-dom/client';
import Container from './Container';

const App = () => {
  return (
    <>
      <Container></Container>
    </>
  );
};

const root = createRoot(document.body);
root.render(<App />);
