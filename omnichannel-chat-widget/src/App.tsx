import React, { useEffect, useState } from 'react';
import { OmnichannelChatSDK } from "@microsoft/omnichannel-chat-sdk";
import {LiveChatWidget} from "@microsoft/omnichannel-chat-widget";
import './App.css';

const fetchOmnichannelChatConfig = () => {
  const omnichannelConfig = { // Default config
    orgId: process.env.REACT_APP_orgId || '',
    orgUrl: process.env.REACT_APP_orgUrl || '',
    widgetId: process.env.REACT_APP_widgetId || ''
  };

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
        <LiveChatWidget {...liveChatWidgetProps} />
      </div>
    </div>
  );
}

export default App;
