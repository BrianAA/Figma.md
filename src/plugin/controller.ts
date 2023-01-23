figma.showUI(__html__, { height: 850, width: 500 });

figma.on('selectionchange', async () => {});

figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'buildDefault':
      CreateDefaultComponents();
      break;
    case 'setMarkdown':
      let markdownData = {
        id: figma.currentPage.selection[0].id,
        markdown: msg.markdown,
      };
      BuildMarkdown(markdownData);
      break;
    case 'loadMarkDown':
      const selection = figma.currentPage.children[0];
      if (selection.type == 'FRAME') {
        const data = await GetMarkdown(figma.currentPage.selection[0].id);
        figma.ui.postMessage({
          type: 'loadMarkdown',
          message: data,
        });
      }
      break;
    default:
      break;
  }
};

async function GetMarkdown(docID) {
  try {
    const storedIDs = figma.root.getPluginData('componentIDs');
    const componentIDs = JSON.parse(storedIDs);
    const doc = figma.getNodeById(docID) as FrameNode;
    let markdownData = '';

    for (let i = 0; i < doc.children.length; i++) {
      const child = doc.children[i];

      if (child.type == 'INSTANCE') {
        const mainID = child.mainComponent.id;
        for (let key in componentIDs) {
          const compareID = componentIDs[key];
          if (compareID == mainID) {
            switch (key) {
              case 'heading1':
                markdownData = markdownData + `\n# ${await GetText(child)} \n`;
                break;
              case 'heading2':
                markdownData = markdownData + `\n## ${await GetText(child)} \n`;
                break;
              case 'heading3':
                markdownData = markdownData + `\n### ${await GetText(child)} \n`;
                break;
              case 'heading4':
                markdownData = markdownData + `\n#### ${await GetText(child)} \n`;
                break;
              case 'heading5':
                markdownData = markdownData + `\n##### ${await GetText(child)} \n`;
                break;
              case 'heading5':
                markdownData = markdownData + `\n###### ${await GetText(child)} \n`;
                break;
              case 'paragraph':
                markdownData = markdownData + `\n${await GetText(child)} \n`;
                break;
              case 'thematicBreak':
                markdownData = markdownData + `\n--- \n`;
              case 'link':
                markdownData = markdownData;
              default:
                break;
            }
          }
        }
      } else {
        child.remove();
        i = i - 1;
      }
    }
    return markdownData;
  } catch (error) {
    console.log(error);
  }
}

async function BuildMarkdown(markdownData) {
  let doc = figma.getNodeById(markdownData.id) as FrameNode;
  let blocks = markdownData.markdown; // markdown data
  let storedIDs = figma.root.getPluginData('componentIDs');
  let ids; //markdown components
  if (!storedIDs) {
    ids = await CreateDefaultComponents();
  } else {
    ids = JSON.parse(storedIDs);
  }
  try {
    if (!doc) throw Error('Document does not exist');
    while (blocks.length < doc.children.length) {
      for (let c = blocks.length - 1; doc.children.length; c++) {
        const child = doc.children[c];
        child.remove();
      }
    }
    //Remaining blocks if there are new ones
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const existingChild = doc.children[i];
      if (existingChild) {
        if (existingChild.type == 'INSTANCE') {
          const markdownType = GetMarkdownType(block);
          const _newMainComponent = figma.getNodeById(ids[markdownType]) as ComponentNode;
          if (_newMainComponent) {
            existingChild.swapComponent(_newMainComponent);
            existingChild.name = _newMainComponent.name;
            SetText(existingChild, block);
          }
        }
      } else {
        console.log('Creating component');
        await CreateBlockType(block, ids, doc);
      }
    }

    // if (doc.children.length > blocks.length) {
    //   doc.children.forEach((element, i) => {
    //     if (element.type == 'INSTANCE') {
    //       const mainID = element.mainComponent.id;
    //       for (let key in ids) {
    //         if (ids[key] == mainID && i > blocks.length) {
    //           element.remove();
    //         }
    //       }
    //     }
    //   });
    // }
  } catch (error) {
    console.log(error);
    figma.notify(error, { error: true });
  }
}

async function CreateBlockType(block, ids, parent) {
  if (block.type != 'html') {
    const _markdownType = GetMarkdownType(block);
    const ComponentNode = figma.getNodeById(ids[_markdownType]) as ComponentNode;
    const instance = ComponentNode.createInstance();
    parent.appendChild(instance);
    instance.name = `${_markdownType}`;
    instance.layoutAlign = 'STRETCH';
    return instance;
  }
}

function GetMarkdownType(block) {
  if (block.type == 'heading') {
    return `heading${block.depth}`;
  } else {
    return block.type;
  }
}

async function SetText(instance, block) {
  for (let i = 0; i < instance.children.length; i++) {
    const node = instance.children[i];
    if (node.name == 'value' && node.type == 'TEXT') {
      if (typeof node.fontName == 'symbol') return; //Throw error;
      await figma.loadFontAsync(node.fontName);
      node.characters = block.children[0].value;
    }
  }
}

async function GetText(instance) {
  for (let i = 0; i < instance.children.length; i++) {
    const node = instance.children[i];
    if (node.name == 'value' && node.type == 'TEXT') {
      if (typeof node.fontName == 'symbol') return; //Throw error;
      await figma.loadFontAsync(node.fontName);
      return node.characters;
    }
  }
}

async function CreateDefaultComponents() {
  let ComponentIDs = {};
  //Load default fonts
  const boldFont = { family: 'Inter', style: 'Bold' };
  const defaultFont = { family: 'Inter', style: 'Regular' };
  const italicFont = { family: 'Inter', style: 'Italic' };
  const codeFont = { family: 'PT Mono', style: 'Regular' };
  await figma.loadFontAsync(defaultFont); //Heading
  await figma.loadFontAsync(boldFont); // Text
  await figma.loadFontAsync(italicFont); //Qoute
  await figma.loadFontAsync(codeFont); //Code

  //Create Page for components
  let componentPage = figma.createPage();
  componentPage.name = '📃 Figma.md Components';
  let Organizer = figma.createFrame();
  Organizer.layoutMode = 'VERTICAL';
  Organizer.resize(300, 100);
  Organizer.primaryAxisSizingMode = 'AUTO';
  Organizer.counterAxisSizingMode = 'FIXED';
  Organizer.itemSpacing = 16;
  Organizer.name = 'Markdown Component Styles';
  componentPage.appendChild(Organizer);
  //Generate Headings
  for (let i = 0; i < 6; i++) {
    let defaultSizes = [32, 28, 24, 20, 18, 16];
    //Create frame for text to live in
    const headingFrame = figma.createComponent();
    headingFrame.layoutMode = 'HORIZONTAL';
    headingFrame.paddingBottom = i < 4 ? 16 : 8;
    headingFrame.primaryAxisSizingMode = 'FIXED';
    headingFrame.counterAxisSizingMode = 'AUTO';
    headingFrame.resize(200, 100);
    headingFrame.layoutAlign = 'STRETCH';
    headingFrame.name = `Heading ${i + 1}`;

    // Create actual text
    const heading = figma.createText();
    if (i + 1 < 4) {
      heading.fontName = boldFont;
    }
    heading.characters = `Heading ${i + 1}`;
    heading.name = 'value';
    heading.layoutGrow = 1;
    heading.fontSize = defaultSizes[i];
    headingFrame.addComponentProperty('value', 'TEXT', `Heading ${i + 1}`);
    headingFrame.appendChild(heading);
    Organizer.appendChild(headingFrame);
    ComponentIDs[`heading${i + 1}`] = headingFrame.id;
  }
  //Create frame for text to live in
  const codingFrame = figma.createComponent();
  codingFrame.layoutMode = 'HORIZONTAL';
  codingFrame.paddingLeft = 4;
  codingFrame.paddingRight = 4;
  codingFrame.cornerRadius = 2;
  const codingBackgroundFill: SolidPaint = {
    type: 'SOLID',
    color: {
      r: 240 / 255,
      b: 240 / 255,
      g: 240 / 255,
    },
    opacity: 1,
    visible: true,
  };

  //Frame for code text to live in
  codingFrame.primaryAxisSizingMode = 'FIXED';
  codingFrame.counterAxisSizingMode = 'AUTO';
  codingFrame.fills = [codingBackgroundFill];
  codingFrame.primaryAxisAlignItems = 'CENTER';
  codingFrame.counterAxisAlignItems = 'CENTER';
  codingFrame.resize(200, 100);
  codingFrame.layoutAlign = 'STRETCH';
  codingFrame.name = `Inline Code`;

  //CODE TEXT
  const coding = figma.createText();
  coding.fontName = codeFont;
  coding.characters = `Inline Code`;
  coding.layoutGrow = 1;
  coding.fontSize = 16;
  coding.name = 'value';
  codingFrame.appendChild(coding);
  Organizer.appendChild(codingFrame);
  ComponentIDs['inlineCode'] = codingFrame.id;

  //Block Qoute Code
  const blockQuoteFrame = figma.createComponent();
  blockQuoteFrame.layoutMode = 'HORIZONTAL';
  blockQuoteFrame.primaryAxisSizingMode = 'FIXED';
  blockQuoteFrame.counterAxisSizingMode = 'AUTO';
  blockQuoteFrame.layoutAlign = 'STRETCH';
  blockQuoteFrame.itemSpacing = 4;
  blockQuoteFrame.paddingBottom = 16;
  blockQuoteFrame.paddingTop = 16;

  const blockQuoteAccent = figma.createFrame();
  const accentFill: SolidPaint = {
    type: 'SOLID',
    color: {
      r: 0.75,
      b: 0.75,
      g: 0.75,
    },
    opacity: 1,
    visible: true,
  };
  blockQuoteAccent.fills = [accentFill];
  blockQuoteAccent.resize(2, 100);
  blockQuoteAccent.layoutAlign = 'STRETCH';
  blockQuoteFrame.appendChild(blockQuoteAccent);
  blockQuoteAccent.name = 'Accent';

  const blockQuoteText = figma.createText();
  blockQuoteText.fontName = italicFont;
  blockQuoteText.layoutGrow = 1;
  blockQuoteText.fontSize = 20;
  blockQuoteText.characters = 'Block Quote';
  blockQuoteText.name = 'value';

  blockQuoteFrame.appendChild(blockQuoteText);
  Organizer.appendChild(blockQuoteFrame);
  ComponentIDs['blockQuote'] = blockQuoteFrame.id;

  //Link Text
  const linkFrame = figma.createComponent();
  linkFrame.layoutMode = 'HORIZONTAL';
  linkFrame.primaryAxisSizingMode = 'FIXED';
  linkFrame.counterAxisSizingMode = 'AUTO';
  linkFrame.primaryAxisAlignItems = 'CENTER';
  linkFrame.counterAxisAlignItems = 'CENTER';
  linkFrame.resize(200, 100);
  linkFrame.layoutAlign = 'STRETCH';
  linkFrame.name = `Link`;

  //Link TEXT
  const linkText = figma.createText();
  const linkColor: SolidPaint = {
    type: 'SOLID',
    color: {
      r: 87 / 255,
      b: 197 / 255,
      g: 132 / 255,
    },
    opacity: 1,
    visible: true,
  };
  linkText.fontName = defaultFont;
  linkText.characters = `Link`;
  linkText.layoutGrow = 1;
  linkText.fontSize = 16;
  linkText.fills = [linkColor];
  linkText.name = 'value';
  linkFrame.appendChild(linkText);
  Organizer.appendChild(linkFrame);
  ComponentIDs['link'] = linkFrame.id;

  //Strong Text
  const strongFrame = figma.createComponent();
  strongFrame.layoutMode = 'HORIZONTAL';
  strongFrame.primaryAxisSizingMode = 'FIXED';
  strongFrame.counterAxisSizingMode = 'AUTO';
  strongFrame.primaryAxisAlignItems = 'CENTER';
  strongFrame.counterAxisAlignItems = 'CENTER';
  strongFrame.resize(200, 100);
  strongFrame.layoutAlign = 'STRETCH';
  strongFrame.name = `Link`;

  //Strong TEXT
  const strongText = figma.createText();
  strongText.fontName = boldFont;
  strongText.characters = `Strong`;
  strongText.layoutGrow = 1;
  strongText.fontSize = 16;
  strongText.name = 'value';
  strongFrame.appendChild(strongText);
  Organizer.appendChild(strongFrame);
  ComponentIDs['strong'] = strongFrame.id;

  //Plain Text
  const plainTextFrame = figma.createComponent();
  plainTextFrame.layoutMode = 'HORIZONTAL';
  plainTextFrame.primaryAxisSizingMode = 'FIXED';
  plainTextFrame.counterAxisSizingMode = 'AUTO';
  plainTextFrame.primaryAxisAlignItems = 'CENTER';
  plainTextFrame.counterAxisAlignItems = 'CENTER';
  plainTextFrame.resize(200, 100);
  plainTextFrame.layoutAlign = 'STRETCH';
  plainTextFrame.name = `Plain-text`;

  //Plain TEXT
  const plainText = figma.createText();
  plainText.fontName = defaultFont;
  plainText.characters = `Default Text`;
  plainText.layoutGrow = 1;
  plainText.fontSize = 16;
  plainText.name = 'value';
  plainTextFrame.appendChild(plainText);
  Organizer.appendChild(plainTextFrame);
  ComponentIDs['paragraph'] = plainTextFrame.id;

  //Emphasis Text
  const emphasisFrame = figma.createComponent();
  emphasisFrame.layoutMode = 'HORIZONTAL';
  emphasisFrame.primaryAxisSizingMode = 'FIXED';
  emphasisFrame.counterAxisSizingMode = 'AUTO';
  emphasisFrame.primaryAxisAlignItems = 'CENTER';
  emphasisFrame.counterAxisAlignItems = 'CENTER';
  emphasisFrame.resize(200, 100);
  emphasisFrame.layoutAlign = 'STRETCH';
  emphasisFrame.name = `emphasis`;

  //CODE TEXT
  const emphasisText = figma.createText();
  emphasisText.fontName = italicFont;
  emphasisText.characters = `Emphasis`;
  emphasisText.layoutGrow = 1;
  emphasisText.fontSize = 16;
  emphasisText.name = 'value';
  emphasisFrame.appendChild(emphasisText);
  Organizer.appendChild(emphasisFrame);
  ComponentIDs['emphasis'] = emphasisFrame.id;

  // Thematic break
  const breakFrame = figma.createComponent();
  breakFrame.layoutMode = 'HORIZONTAL';
  breakFrame.primaryAxisSizingMode = 'FIXED';
  breakFrame.counterAxisSizingMode = 'AUTO';
  breakFrame.layoutAlign = 'STRETCH';
  breakFrame.paddingBottom = 16;
  breakFrame.paddingTop = 16;
  breakFrame.name = 'Thematic-Break';

  //Fill
  const breakRule = figma.createFrame();
  const breakFill: SolidPaint = {
    type: 'SOLID',
    color: {
      r: 0.85,
      b: 0.85,
      g: 0.85,
    },
    opacity: 1,
    visible: true,
  };
  breakRule.resize(100, 2);
  breakRule.layoutGrow = 1;
  breakRule.fills = [breakFill];
  breakRule.name = 'Fill';
  breakFrame.appendChild(breakRule);
  Organizer.appendChild(breakFrame);
  ComponentIDs['thematicBreak'] = breakFrame.id;

  //Unordered List Item
  const listItemFrame = figma.createComponent();
  listItemFrame.layoutMode = 'HORIZONTAL';
  listItemFrame.primaryAxisSizingMode = 'FIXED';
  listItemFrame.counterAxisSizingMode = 'AUTO';
  listItemFrame.counterAxisAlignItems = 'CENTER';
  listItemFrame.layoutAlign = 'STRETCH';
  listItemFrame.itemSpacing = 4;
  listItemFrame.paddingBottom = 16;
  listItemFrame.paddingTop = 16;

  const listItemAccent = figma.createFrame();
  const listAccentFill: SolidPaint = {
    type: 'SOLID',
    color: {
      r: 0.75,
      b: 0.75,
      g: 0.75,
    },
    opacity: 1,
    visible: true,
  };
  listItemAccent.fills = [listAccentFill];
  listItemAccent.resize(8, 8);
  listItemAccent.cornerRadius = 8;
  listItemFrame.appendChild(listItemAccent);
  listItemAccent.name = 'Accent';

  const listItemText = figma.createText();
  listItemText.fontName = defaultFont;
  listItemText.layoutGrow = 1;
  listItemText.fontSize = 16;
  listItemText.characters = 'List Item';
  listItemText.name = 'value';

  listItemFrame.appendChild(listItemText);
  Organizer.appendChild(listItemFrame);
  ComponentIDs['unorderedList'] = listItemFrame.id;

  //Ordered List Item
  const orderedListItemFrame = figma.createComponent();
  orderedListItemFrame.layoutMode = 'HORIZONTAL';
  orderedListItemFrame.primaryAxisSizingMode = 'FIXED';
  orderedListItemFrame.counterAxisSizingMode = 'AUTO';
  orderedListItemFrame.counterAxisAlignItems = 'CENTER';
  orderedListItemFrame.layoutAlign = 'STRETCH';
  orderedListItemFrame.itemSpacing = 4;
  orderedListItemFrame.paddingBottom = 16;
  orderedListItemFrame.paddingTop = 16;

  const orderedListItemNumber = figma.createText();
  orderedListItemNumber.fontName = defaultFont;
  orderedListItemNumber.layoutGrow = 0;
  orderedListItemNumber.fontSize = 16;
  orderedListItemNumber.characters = '1.';
  orderedListItemNumber.name = 'index-value';

  const orderedListItemText = figma.createText();
  orderedListItemText.fontName = defaultFont;
  orderedListItemText.layoutGrow = 1;
  orderedListItemText.fontSize = 16;
  orderedListItemText.characters = 'Ordered List Item';
  orderedListItemText.name = 'value';

  orderedListItemFrame.appendChild(orderedListItemNumber);
  orderedListItemFrame.appendChild(orderedListItemText);
  Organizer.appendChild(orderedListItemFrame);
  ComponentIDs['orderedList'] = orderedListItemFrame.id;

  //TODO Add checkbox and ``` Code snippets```
  //Store keys
  const root = figma.root;
  root.setPluginData('componentIDs', JSON.stringify(ComponentIDs));
  return ComponentIDs;
}
