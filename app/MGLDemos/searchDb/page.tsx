import SearchProjects from "./searchProjects";
import ProjectList from "./projectList";

const ProjectPage = ({
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      filter?: string;
    };
  }) => {
    const query = searchParams?.query?.toString() || '';
    const filter = searchParams?.filter?.toString() || '';

  return (
    <div>
        <h1>Search Projects Here:</h1>
        <SearchProjects />
        <ProjectList query={query} filter={filter} />
    </div>
  )
}

export default ProjectPage