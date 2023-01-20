import type { NextPage } from 'next';
import Metatags from '../../../components/site/metatags';
import { useRouter } from 'next/router';
import Listing from '../../../components/featureBounty/Listing';
import Activity from '../../../components/featureBounty/Activity';
import Markdoc from '@markdoc/markdoc';
import { useState } from 'react';
import {
  Bars3BottomLeftIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid';
import Button from '../../../components/ui/button';
import Input from '../../../components/ui/input';
import Textarea from '../../../components/ui/textarea';
import Breadcrumb from '../../../components/featureBounty/Breadcrumb';

const ProjectTreasuryEscrowDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const isNew = id === 'new';

  return (
    <>
      <Metatags
        title="Project Treasury + Escrow"
        description="Project Treasury + Escrow"
      />
      <div className="py-8 bg-white dark:bg-gray-900">
        <div className="px-4 mx-auto max-w-screen-xl">
          {isNew ? (
            <Breadcrumb featureName={`New Feature`} />
          ) : (
            <Breadcrumb
              category={'transaction'}
              featureName={`Get something from tx`}
            />
          )}

          {isNew ? <New /> : <Display />}
        </div>
      </div>
    </>
  );
};

export default ProjectTreasuryEscrowDetailPage;

function New() {
  let newLongDetail = '';
  newLongDetail += '## Outcome:\n';
  newLongDetail += '- Create...\n';
  newLongDetail += '\n';
  newLongDetail += '## Test condtions:\n';
  newLongDetail += '- It must...\n';

  const [title, setTitle] = useState<string>('');
  const [shortDetail, setShortDetail] = useState<string>('');
  const [longDetail, setlongDetail] = useState<string>(newLongDetail);
  const [editLongDetail, setEditLongDetail] = useState<boolean>(false);

  const ast = Markdoc.parse(longDetail);
  const content = Markdoc.transform(ast /* config */);

  const html = Markdoc.renderers.html(content);
  console.log('html', { editLongDetail, longDetail });

  function toggleLongDetail() {
    setEditLongDetail(!editLongDetail);
  }

  function submitRequest() {}

  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="max-w-2xl px-4 mx-auto">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Request a new feature
          </h2>

          <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
            <div className="col-span-2">
              <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="a short descriptive title"
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="category"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
              >
                Select a category
              </label>
              <select
                id="category"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected>Choose a category</option>
                <option value="Transaction">Transaction</option>
                <option value="Wallet">Wallet</option>
                <option value="Integration">Integration</option>
                <option value="Starter Kit">Starter Kit</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Description
              </label>
              <Textarea
                value={shortDetail}
                onChange={(e) => setShortDetail(e.target.value)}
                rows={4}
              />
            </div>

            <div className="col-span-2">
              <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
                <div className="flex justify-end">
                  <span className="flex-1">Full Details</span>
                  <Button
                    onClick={() => toggleLongDetail()}
                    className="flex-none"
                  >
                    {editLongDetail ? (
                      <PencilSquareIcon className="w-4 h-4" />
                    ) : (
                      <Bars3BottomLeftIcon className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </label>
              {editLongDetail ? (
                <div
                  className="format dark:format-invert"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <Textarea
                  value={longDetail}
                  onChange={(e) => setlongDetail(e.target.value)}
                  rows={16}
                />
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Button onClick={() => submitRequest()}>Request feature</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Display() {
  let demoLongDetails = '';
  demoLongDetails += '## Outcome:\n';
  demoLongDetails +=
    '- Each Project Card and Project Page shows the number of current open commitments, and only allows multiple commitments when `multipleCommitments` is true.\n';
  demoLongDetails += '\n';
  demoLongDetails += '## Requirements:\n';
  demoLongDetails +=
    '- Add logic so that a Contributor should only be allowed to Commit to a Project if one of the following is true:\n';
  demoLongDetails += '    1. `multipleCommitments` is true, OR\n';
  demoLongDetails += '    2. No Commitments to the Project currently exist.\n';
  demoLongDetails +=
    '- Add a visual indication of Project Commitment status on `/projects/index.tsx` and `/projects/[id].tsx`\n';
  demoLongDetails += '\n';
  demoLongDetails += '## How To Start:\n';
  demoLongDetails += '- Create a new branch of GPTE Front End.\n';
  demoLongDetails += '\n';
  demoLongDetails += '## Links + Tips:\n';
  demoLongDetails +=
    '- Use on-chain metadata to check the current list of Commitments to a Project.\n';
  demoLongDetails +=
    '- To get started, look at some of the raw data in `/dashboard` route.\n';
  demoLongDetails += '\n';
  demoLongDetails += '## How To Complete:\n';
  demoLongDetails +=
    '- Submit a Merge Request to [GPTE-front-end](https://gitlab.com/gimbalabs/plutus-pbl-summer-2022/projects/GPTE/GPTE-front-end) with your changes to `gpte-front-end/cardano/plutus/treasuryContract.js` and `gpte-front-end/components/transactions/commitToProject.tsx`.  \n';

  const ast = Markdoc.parse(demoLongDetails);
  const content = Markdoc.transform(ast /* config */);

  const html = Markdoc.renderers.html(content);

  function commitToWork() {}

  return (
    <div className="grid grid-flow-row-dense grid-cols-2 place-content-start gap-8">
      <div>
        <Listing
          title={'Get something from tx'}
          description={
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
          }
          vote={'15'}
        />

        <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div
            className="format dark:format-invert"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        <Button onClick={() => commitToWork()}>Commit to work on this</Button>
      </div>
      <Activity />
    </div>
  );
}
