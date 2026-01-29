import { BrowserRouter } from 'react-router-dom';
import AppContent from './AppContent';

// App.jsx is now a thin wrapper: only router + root content.
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
