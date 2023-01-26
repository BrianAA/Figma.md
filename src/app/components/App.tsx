import React from 'react';
import '../styles/ui.css';
import Editor from 'react-simple-code-editor';
import { refractor } from 'refractor/lib/core';
import markdown from 'refractor/lang/markdown';
import { toHtml } from 'hast-util-to-html';
import parser from 'html-react-parser';
import 'prism-themes/themes/prism-ghcolors.css';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmTaskListItem } from 'micromark-extension-gfm-task-list-item';
import { gfmTaskListItemFromMarkdown } from 'mdast-util-gfm-task-list-item';

refractor.register(markdown);

function App() {
  // const [Blocks, setBlocks] = React.useState();
  const [Data, setData] = React.useState('');
  const [Building, setBuilding] = React.useState(false);
  function CreateMarkdownEditor(data) {
    const items = refractor.highlight(data, 'markdown');
    const html = toHtml(items);
    return parser(html);
  }

  function HandleChange(e) {
    setData(e);
  }
  
  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === "loadMarkdown") {
        setData(message)
      }
    }
  }, []);

  React.useEffect(() => {
    const Markdown = fromMarkdown(Data, {
      extensions: [gfmTaskListItem],
      mdastExtensions: [gfmTaskListItemFromMarkdown],
    });
    if (Markdown.children.length == 0) return;
    parent.postMessage(
      {
        pluginMessage: {
          type: 'setMarkdown',
          markdown: Markdown.children,
        },
      },
      '*'
    );
  }, [Data]);

  function BuildDefault() {
    setBuilding(true);
    parent.postMessage(
      {
        pluginMessage: {
          type: 'buildDefault',
        },
      },
      '*'
    );
  }

  function LoadMarkdown() {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'loadMarkDown',
        },
      },
      '*'
    );
  }

  function SaveMarkdown() {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'saveMarkDown',
          data:Data
        },
      },
      '*'
    );
  }
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

      <button disabled={Building} onClick={BuildDefault}>Build Default</button>
      <button  onClick={LoadMarkdown}>Load Markdown</button>
      <button  onClick={SaveMarkdown}>Save Markdown</button>
    </div>
  );
}

export default App;
