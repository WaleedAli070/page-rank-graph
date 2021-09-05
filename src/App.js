import logo from "./logo.svg";
import "./App.css";
import { GraphWrapper } from "./components";
import { data } from "./constants/data";

function App() {
  return (
    <div className="App">
      <GraphWrapper nodes={data.nodes} links={data.links} />
    </div>
  );
}

export default App;
