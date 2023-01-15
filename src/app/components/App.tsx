import React from 'react';
import '../styles/ui.css';
import Editor from 'react-simple-code-editor';
import { refractor } from 'refractor/lib/core';
import markdown from 'refractor/lang/markdown';
import { toHtml } from 'hast-util-to-html';

import parser from 'html-react-parser';
import 'prism-themes/themes/prism-ghcolors.css';
import { fromMarkdown } from 'mdast-util-from-markdown';
refractor.register(markdown);

function App() {
  // const [Blocks, setBlocks] = React.useState();
  const [Data, setData] = React.useState('');

  // const onCreate = () => {
  //   parent.postMessage({ pluginMessage: { type: 'create-components' } }, '*');
  // };

  function CreateMarkdownEditor(data) {
    console.log(data);
    const items = refractor.highlight(data, 'markdown');
    const html = toHtml(items);
    const markdownItems = fromMarkdown(data);
    console.log(markdownItems);
    return parser(html);
  }

  function HandleChange(e) {
    setData(e);
  }
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
      <Editor
        value={Data}
        onValueChange={(code) => HandleChange(code)}
        highlight={(data) => CreateMarkdownEditor(data)}
        padding={10}
        style={{
          resize: 'vertical',
          minHeight: '10vh',
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          border: `1px solid #E9E9E9 `,
        }}
      />
    </div>
  );
}

export default App;
