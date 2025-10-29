import React, { useEffect } from 'react';
import { DocumentEditor } from '@onlyoffice/document-editor-react';
const OnlyOfficeEditor = ({config}) => {

  useEffect(() => {
    config.frameId = 'asdas'
    config.buttonColor =  "#5299E0";
    console.log(config);
  }, []);

  return (
    <div className='m-0 p-0' style={{ height: '90vh' }}>
      <DocumentEditor
        id="onlyoffice-editor"
        config={config}
        
        // documentServerUrl="https://02f9-141-148-219-236.ngrok-free.app"
        documentServerUrl="http://192.168.1.4:8080"
      />
    </div>
  );
};

export default OnlyOfficeEditor;