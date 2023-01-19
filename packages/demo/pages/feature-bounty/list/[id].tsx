import type { NextPage } from 'next';
import Metatags from '../../../components/site/metatags';
import { useRouter } from 'next/router';
import Listing from '../../../components/featureBounty/Listing';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Breadcrumb from '../../../components/featureBounty/Breadcrumb';
import Button from '../../../components/ui/button';

const ProjectTreasuryEscrowListPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Metatags
        title="Project Treasury + Escrow"
        description="Project Treasury + Escrow"
      />
      <div className="py-8 bg-white dark:bg-gray-900">
        <div className="px-4 mx-auto max-w-screen-xl">
          <Breadcrumb category={'transaction'} />
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
            Transaction
          </h2>

          <div className="grid grid-flow-row-dense grid-cols-3 place-content-start gap-8">
            <div>
              <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 font-normal text-gray-700 dark:text-gray-400">
                <p>Here we wanna say what this is what page is about. </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum. is.
                </p>
                <Link href={`/feature-bounty/info/new`}>
                  <Button>
                    New Feature Request
                    <ArrowRightIcon className="ml-2 -mr-1 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="col-span-2">
              <Listing
                title={'Get something from tx'}
                description={
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                }
                vote={'15'}
                clickable={true}
              />
              <Listing
                title={'Connect with special wallet'}
                description={
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                }
                vote={'23'}
                clickable={true}
              />
              <Listing
                title={'Get something from tx'}
                description={
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                }
                vote={'15'}
                clickable={true}
              />
              <Listing
                title={'Connect with special wallet'}
                description={
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                }
                vote={'23'}
                clickable={true}
              />
              <Listing
                title={'Get something from tx'}
                description={
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                }
                vote={'15'}
                clickable={true}
              />
              <Listing
                title={'Connect with special wallet'}
                description={
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                }
                vote={'23'}
                clickable={true}
              />
              <Listing
                title={'Get something from tx'}
                description={
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                }
                vote={'15'}
                clickable={true}
              />
              <Listing
                title={'Connect with special wallet'}
                description={
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                }
                vote={'23'}
                clickable={true}
              />
              <Listing
                title={'Get something from tx'}
                description={
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                }
                vote={'15'}
                clickable={true}
              />
              <Listing
                title={'Connect with special wallet'}
                description={
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                }
                vote={'23'}
                clickable={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectTreasuryEscrowListPage;
