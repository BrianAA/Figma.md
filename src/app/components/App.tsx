import React from 'react';
import '../styles/ui.css';

function App() {


  const onCreate = () => {
    parent.postMessage({ pluginMessage: { type: 'create-components' } }, '*');
  };


  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-rectangles') {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  return (
    <div>
      <button id="create" onClick={onCreate}>
        Create
      </button>
    </div>
  );
}

export default App;
