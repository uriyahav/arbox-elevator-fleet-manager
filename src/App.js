import './App.css';
import ErrorBoundary from './component/ErrorBoundary';
import './component/Table'
import Table from './component/Table';


function App() {
  return (
    <div className="App">
      <h1>Arbox Elevator </h1>
      <ErrorBoundary>
      <Table></Table>
      </ErrorBoundary>
    </div>
  );
}

export default App;
