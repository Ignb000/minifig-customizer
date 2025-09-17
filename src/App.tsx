import "./styles/layout.css";
import Preview from "./components/Preview";
import Settings from "./components/Settings";

export default function App(){
  return (
    <main className="app">
      <section className="panel preview-sticky"><Preview/></section>
      <aside className="panel"><Settings/></aside>
    </main>
  );
}