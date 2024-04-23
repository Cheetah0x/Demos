import SearchProjects from "./searchProjects";
import ProjectList from "./projectList";

const ProjectPage = ({
    searchParams,
  }: {
    searchParams?: {
      query?: string;
    };
  }) => {
    const query = searchParams?.query || '';

  return (
    <div>
        <h1>Search Projects Here:</h1>
        <SearchProjects />
        <ProjectList query={query} />
    </div>
  )
}

export default ProjectPage