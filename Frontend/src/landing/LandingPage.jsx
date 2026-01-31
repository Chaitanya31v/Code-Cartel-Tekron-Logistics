import Hero from "./Hero";
import Navbar from "./Navbar"
import ProblemSolution from "./ProblemSolution";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <ProblemSolution />
    </div>
  );
}

export default LandingPage
