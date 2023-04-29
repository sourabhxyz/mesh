import { useState } from 'react';
import SectionTwoCol from '../../../common/sectionTwoCol';
import Card from '../../../ui/card';
import RunDemoButton from '../../../common/runDemoButton';
import RunDemoResult from '../../../common/runDemoResult';
import Codeblock from '../../../ui/codeblock';
import Input from '../../../ui/input';

export default function GetHandlePersonalized({ provider, handle, setHandle }) {
  return (
    <>
      <SectionTwoCol
        sidebarTo="getHandlePersonalized"
        header="getHandlePersonalized"
        leftFn={LeftContent({ handle })}
        rightFn={RightContent({ provider, handle, setHandle })}
        isH3={true}
      />
    </>
  );
}

function LeftContent({ handle }) {
  let codeResponse = `a2446e616d654b436c65766572204769726c4469706673582e516d50636b3439384379355457594a53354e69667832523834466a596a4a4c693662386f484d4e6b666878705334`;

  let code = `import { HandleProvider } from '@meshsdk/core';\n\n`;
  code += `const handleProvider = new HandleProvider();\n`;
  code += `const res = await handleProvider.getHandlePersonalized('${handle}');`;

  return (
    <>
      <p>Get the datum in the same UTxO as the Handle, if present.</p>
      <Codeblock data={code} isJson={false} />
      <p>Expected output:</p>
      <Codeblock data={codeResponse} isJson={false} />
    </>
  );
}

function RightContent({ provider, handle, setHandle }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<null | any>(null);
  const [responseError, setResponseError] = useState<null | any>(null);

  async function runDemo() {
    setLoading(true);
    setResponse(null);
    setResponseError(null);
    try {
      const res = await provider.getHandlePersonalized(handle);
      setResponse(res);
    } catch (error) {
      setResponseError(`${error}`);
    }
    setLoading(false);
  }

  return (
    <Card>
      <div className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
        Get Handle Datum
        <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
          Get the datum in the same UTxO as the Handle, if present.
        </p>
      </div>

      <Input
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        placeholder="Handle"
        label="Handle"
      />

      <Codeblock
        data={`const handleMeta = await handleProvider.getHandlePersonalized('${handle}');`}
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
