import type { NextPage } from 'next';
import Dashboard from '../../components/featureBounty/Dashboard';
import Roadmap from '../../components/featureBounty/Roadmap';
import SelectCategory from '../../components/featureBounty/SelectCategory';
import Metatags from '../../components/site/metatags';

const ProjectTreasuryEscrowPage: NextPage = () => {
  return (
    <>
      <Metatags
        title="Mesh Features Bounty"
        description="Mesh Features Bounty"
      />
      <div className="py-8 bg-white dark:bg-gray-900">
        <div className="px-4 mx-auto max-w-screen-xl">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white text-center">
            Mesh Features Bounty
          </h2>
          <div className="grid grid-cols-2 gap-8">
            <SelectCategory />
            <Dashboard />
          </div>

          <Roadmap />
        </div>
      </div>
    </>
  );
};

export default ProjectTreasuryEscrowPage;
