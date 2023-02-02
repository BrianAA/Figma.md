import React from 'react';
import '../styles/ui.css';
import InitScreen from '../views/initScreen';
import Editor from 'react-simple-code-editor';
import { refractor } from 'refractor/lib/core';
import markdown from 'refractor/lang/markdown';
import { toHtml } from 'hast-util-to-html';
import parser from 'html-react-parser';
import 'prism-themes/themes/prism-ghcolors.css';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmTaskListItem } from 'micromark-extension-gfm-task-list-item';
import { gfmTaskListItemFromMarkdown } from 'mdast-util-gfm-task-list-item';
import { BuildDefault, InitLoad, LoadMarkdown, SaveMarkdown, setMarkdown } from '../command-center';

refractor.register(markdown);

function App() {
  // const [Blocks, setBlocks] = React.useState();
  const [View, setView] = React.useState("init");
  const [mrkDwn_Components, setMrkDownComponents] = React.useState(null)
  const [currentDoc, setCurrentDoc] = React.useState(null)
  const [Data, setData] = React.useState('');

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      switch (type) {
        case 'loadMarkdown':
          setData(message);
          break;
        case 'init-load':
          // setView(message ? "main" : "init")
          setMrkDownComponents(message);
          console.log(message)
          break;
        case 'currentDoc':
          setCurrentDoc(message)
      }
    }

    //Get LoadScreen
    InitLoad()
  }, []);

  React.useEffect(() => {
    const Markdown = fromMarkdown(Data, {
      extensions: [gfmTaskListItem],
      mdastExtensions: [gfmTaskListItemFromMarkdown],
    });
    if (Markdown.children.length == 0) return;
    let formatBlocks = [];
    Markdown.children.forEach(block => {
      if (block.type == "list") {
        block.children.forEach((listItem, i) => {
          listItem["ordered"] = block.ordered;
          listItem["index"] = i + 1;
          formatBlocks.push(listItem);
        })
      } else {
        formatBlocks.push(block)
      }
    });
    if (currentDoc) {
      setMarkdown(currentDoc, formatBlocks)
    }

  }, [Data]);

  function CreateMarkdownEditor(data) {
    const items = refractor.highlight(data, 'markdown');
    const html = toHtml(items);
    return parser(html);
  }

  function HandleChange(e) {
    setData(e);
  }

  return (
    <div>
      {View == "main" &&
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
        />}

      {View == "init" &&
        <InitScreen setView={setView} />
      }

      <button disabled={mrkDwn_Components ? true : false} onClick={BuildDefault}>Build Default</button>
      <button onClick={LoadMarkdown}>Load Markdown</button>
      <button onClick={SaveMarkdown}>Save Markdown</button>
    </div>
  );
}

export default App;
