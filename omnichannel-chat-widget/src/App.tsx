import React, { useEffect, useState } from 'react';
import { OmnichannelChatSDK } from "@microsoft/omnichannel-chat-sdk";
import { LiveChatWidget } from "@microsoft/omnichannel-chat-widget";
import './App.css';

const fetchOmnichannelChatConfig = () => {
  const omnichannelConfig = { // Default config
    orgId: process.env.REACT_APP_orgId || '',
    orgUrl: process.env.REACT_APP_orgUrl || '',
    widgetId: process.env.REACT_APP_widgetId || ''
  };

  const urlParams = new URLSearchParams(window.location.search);

  // Overrides default config if URL any param is found
  if (urlParams.get('orgUrl') !== null) {
    omnichannelConfig.orgUrl = urlParams.get('orgUrl')!;
  }

  if (urlParams.get('orgId') !== null) {
    omnichannelConfig.orgId = urlParams.get('orgId')!;
  }

  if (urlParams.get('widgetId') !== null) {
    omnichannelConfig.widgetId = urlParams.get('widgetId')!;
  }

  return omnichannelConfig;
}

function App() {
  const [liveChatWidgetProps, setLiveChatWidgetProps] = useState<any>();

  useEffect(() => {
    const init = async () => {
      const omnichannelConfig = fetchOmnichannelChatConfig();

      const chatSDK = new OmnichannelChatSDK(omnichannelConfig);
      await chatSDK.initialize();
      const chatConfig = await chatSDK.getLiveChatConfig();

      const liveChatWidgetProps = {
        styleProps: {
          generalStyles: {
              width: "400px",
              height: "600px",
              bottom: "30px",
              right: "30px"
          }
        },
        chatSDK,
        chatConfig
      };

      setLiveChatWidgetProps(liveChatWidgetProps);
    }

    init();
  }, []);

  return (
    <div className="App">
      <div>
        {liveChatWidgetProps && <LiveChatWidget {...liveChatWidgetProps} />}
      </div>
    </div>
  );
}

export default App;
