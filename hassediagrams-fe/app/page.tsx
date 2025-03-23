import NavItem from "@/components/UI/NavItem";
import { SlOrganization, SlPlus } from "react-icons/sl";

export default function Home() {
  return (
    <div className="h-full flex items-center justify-center mt-16">
      <div className="max-w-xl text-center space-y-8">
        <p className="text-xl font-bold">
          Welcome to Hasse Diagrams – your web application for reliability
          analysis using Hasse diagrams.
        </p>
        <p className="text-lg">
          Create, edit, visualize, and calculate various metrics effortlessly.
          Get started now and see how HasseDiagrams can transform your analysis!
        </p>
        <div className="flex flex-row justify-center space-x-10">
          <NavItem name="Create" link="/create" Icon={SlPlus} />
          <NavItem name="Diagrams" link="/diagrams" Icon={SlOrganization} />
        </div>
        <p className="text-lg">
          Don't have an account yet? Register now to unlock full access to our
          powerful tools and dive into your reliability analysis.
        </p>
        <div className="flex flex-row justify-center space-x-10">
          <NavItem name="Register now!" link="/register" />
        </div>
        <p className="text-lg">
          Already a member? Log in to continue and explore your diagrams.
        </p>
        <div className="flex flex-row justify-center space-x-10">
          <NavItem name="Sign in" link="/signin" />
        </div>
      </div>
    </div>
  );
}
