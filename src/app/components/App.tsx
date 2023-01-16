import React from 'react';
import '../styles/ui.css';
import Editor from 'react-simple-code-editor';
import { refractor } from 'refractor/lib/core';
import markdown from 'refractor/lang/markdown';
import { toHtml } from 'hast-util-to-html';
import { elementToSVG } from 'dom-to-svg';
import parser from 'html-react-parser';
import 'prism-themes/themes/prism-ghcolors.css';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmTaskListItem } from 'micromark-extension-gfm-task-list-item';
import { gfmTaskListItemFromMarkdown } from 'mdast-util-gfm-task-list-item';

refractor.register(markdown);

function App() {
  // const [Blocks, setBlocks] = React.useState();
  const [Data, setData] = React.useState('');
  const [Index, setIndex] = React.useState(0);
  const [Prev, setPrev] = React.useState(-1);
  const test = React.useRef();

  function CreateMarkdownEditor(data) {
    console.log(data);
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
      if (type === 'create-rectangles') {
        console.log(`Figma Says: ${message}`);
      }
    };
    document.addEventListener('keypress', (e) => {
      if (e.key == 'Enter') {
        console.log('Enter');

        setIndex((i) => i + 1);
        setPrev(Index - 1);
      }
    });
  }, []);

  React.useEffect(() => {
    const Markdown = fromMarkdown(Data, {
      extensions: [gfmTaskListItem],
      mdastExtensions: [gfmTaskListItemFromMarkdown],
    });
    if (Markdown.children.length == 0) return;
    if (Prev == Index) return;
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
  function getSVG() {
    if (test) {
      const svg = elementToSVG(test.current);
      console.log(new XMLSerializer().serializeToString(svg));
    }
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
      <button onClick={getSVG}>Get SVG</button>
      <p ref={test}>
        This is text <code>This is code</code> see the difference
      </p>
    </div>
  );
}

export default App;
