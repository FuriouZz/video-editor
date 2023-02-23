import Library from "./components/Library/Library";
import { ProjectProvider } from "./contexts/ProjectContext";

export default function Main() {
  return (
    <div>
      <ProjectProvider>
        <Library></Library>
      </ProjectProvider>
    </div>
  );
}
