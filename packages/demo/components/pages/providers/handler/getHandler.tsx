import { useState } from 'react';
import SectionTwoCol from '../../../common/sectionTwoCol';
import Card from '../../../ui/card';
import RunDemoButton from '../../../common/runDemoButton';
import RunDemoResult from '../../../common/runDemoResult';
import Codeblock from '../../../ui/codeblock';
import Input from '../../../ui/input';

export default function GetHandler({ provider, handler, setHandler }) {
  return (
    <>
      <SectionTwoCol
        sidebarTo="getHandler"
        header="getHandler"
        leftFn={LeftContent({ handler })}
        rightFn={RightContent({ provider, handler, setHandler })}
        isH3={true}
      />
    </>
  );
}

function LeftContent({ handler }) {
  let codeResponse = `{"hex":"6a696e676c6573","name":"jingles","holder_address":"stake1uyzmqrrtnxsn4d3hd57x4p55mtrlwynt42qw8nnf2pdq05g4995kn","length":7,"utxo":"1bb053aedc8ced8b0ec159f9764061fde8295c7f6ed3fc1a84ba3157184c1006#1","rarity":"common","characters":"letters","numeric_modifiers":"","resolved_addresses":{"ada":"addr1qywk2r75gu5e56zawmdp2pk8x74l5waandqaw7d0t5ag9us9kqxxhxdp82mrwmfud2rffkk87ufxh25qu08xj5z6qlgs96hv9k"},"og":0,"original_nft_image":"ipfs://QmR7fkVDT6vMcMAHvUFXY4Hgm24RmfeFDFm8mRFXUqw6Rp","nft_image":"ipfs://QmR7fkVDT6vMcMAHvUFXY4Hgm24RmfeFDFm8mRFXUqw6Rp","background":"","default_in_wallet":"jingles","profile_pic":"","created_slot_number":48259297,"updated_slot_number":84470427,"hasDatum":false}`;
  codeResponse = JSON.parse(codeResponse);
  codeResponse = JSON.stringify(codeResponse, null, 2);

  let code = `import { HandlerProvider } from '@meshsdk/core';\n\n`;
  code += `const handlerProvider = new HandlerProvider();\n`;
  code += `const handlerMeta = await handlerProvider.getHandler('${handler}');`;

  return (
    <>
      <p>
        Provide a Handle, return JSON Handle object, the metadata of Handler.
      </p>
      <Codeblock data={code} isJson={false} />
      <p>Expected output:</p>
      <Codeblock data={codeResponse} isJson={false} />
    </>
  );
}

function RightContent({ provider, handler, setHandler }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<null | any>(null);
  const [responseError, setResponseError] = useState<null | any>(null);

  async function runDemo() {
    console.log('provider', provider);
    const res = await provider.getHandler(handler);
    console.log(res);
    setLoading(true);
    setResponse(null);
    setResponseError(null);
    try {
      const res = await provider.getHandler(handler);
      setResponse(res);
    } catch (error) {
      setResponseError(`${error}`);
    }
    setLoading(false);
  }

  return (
    <Card>
      <div className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
        Get Handler
        <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
          Given the Handler, get Handler's meta
        </p>
      </div>

      <Input
        value={handler}
        onChange={(e) => setHandler(e.target.value)}
        placeholder="Handler"
        label="Handler"
      />

      <Codeblock
        data={`const handlerMeta = await handlerProvider.getHandler('${handler}');`}
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
