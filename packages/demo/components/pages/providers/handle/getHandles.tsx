import { useState } from 'react';
import SectionTwoCol from '../../../common/sectionTwoCol';
import Card from '../../../ui/card';
import RunDemoButton from '../../../common/runDemoButton';
import RunDemoResult from '../../../common/runDemoResult';
import Codeblock from '../../../ui/codeblock';

export default function GetHandles({ provider }) {
  return (
    <>
      <SectionTwoCol
        sidebarTo="getHandles"
        header="getHandles"
        leftFn={LeftContent({})}
        rightFn={RightContent({ provider })}
        isH3={true}
      />
    </>
  );
}

function LeftContent({}) {
  let code = `import { HandleProvider } from '@meshsdk/core';\n\n`;
  code += `const handleProvider = new HandleProvider();\n`;
  code += `const handles = await handleProvider.getHandles({rarity: 'ultra_rare'});`;

  return (
    <>
      <p>Get all minted handles.</p>
      <p>This endpoint accepts a list of optional params:</p>
      <ul>
        <li>
          <code>characters</code>
        </li>
        <li>
          <code>length</code>: Length of handles to return
        </li>
        <li>
          <code>rarity</code>
        </li>
        <li>
          <code>numeric_modifiers</code>
        </li>
        <li>
          <code>records_per_page</code>: Number of Handles to return per page in
          paginated results. Maximum of 1000.
        </li>
        <li>
          <code>page</code>: The page number to return in paginated results.
        </li>
        <li>
          <code>slot_number</code>: The slot number to start at when paginating
          results.
        </li>
        <li>
          <code>holder_address</code>: The holder_address key of the
          wallet/script that the Handle is in. See the Holder endpoints for more
          information
        </li>
      </ul>
      <p>See official API docs for reference.</p>
      <Codeblock data={code} isJson={false} />
    </>
  );
}

function RightContent({ provider }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<null | any>(null);
  const [responseError, setResponseError] = useState<null | any>(null);

  async function runDemo() {
    setLoading(true);
    setResponse(null);
    setResponseError(null);
    try {
      const res = await provider.getHandles();
      setResponse(res);
    } catch (error) {
      setResponseError(`${error}`);
    }
    setLoading(false);
  }

  return (
    <Card>
      <div className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
        Get Handles
        <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
          Get all minted handles.
        </p>
      </div>

      <Codeblock
        data={`const handles = await handleProvider.getHandles({rarity: 'ultra_rare'});`}
        isJson={false}
      />

      <RunDemoButton
        runDemoFn={runDemo}
        loading={loading}
        response={response}
      />

      <RunDemoResult response={response} label="Response" />
      <RunDemoResult response={responseError} label="Error" />
    </Card>
  );
}
