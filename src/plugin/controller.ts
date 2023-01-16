figma.showUI(__html__, { height: 850, width: 500 });
let settings = {
  h1: {
    name: 'text',
    characters: 'Heading 1',
    fontSize: 32,
    style: 'bold',
    parent: {
      name: 'Heading-1',
      paddingBottom: 16,
    },
  },
  h2: {
    characters: 'Heading 2',
    fontSize: 24,
    style: 'bold',
    paddingBottom: 16,
  },
  h3: {
    fontSize: 20,
    style: 'bold',
    paddingBottom: 16,
  },
  h4: {
    fontSize: 16,
    style: 'bold',
    paddingBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    style: 'regular',
    paddingBottom: 16,
  },
  list: {
    fontSize: 16,
    style: 'regular',
    paddingBottom: 16,
  },
};

let Component_IDs = [];
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-components') {
    CreateMarkdownComponents();
  }

  if (msg.type == 'setMarkdown') {
    console.log(msg);
    let id = figma.currentPage.selection[0].id;
    BuildMarkdown(msg.markdown, id);
  }

  async function BuildMarkdown(mkdwn, id) {
    let doc = figma.getNodeById(id) as FrameNode;
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    if (!doc) {
      return;
    }
    if (doc.children.length > 0) {
      doc.children.forEach((element) => {
        element.remove();
      });
    }
    for (let i = 0; i < mkdwn.length; i++) {
      const block = mkdwn[i];
      switch (block.type) {
        case 'heading':
          const heading = figma.createText();
          heading.fontSize = 32;
          heading.characters = block.children[0].value;
          doc.appendChild(heading);
          break;
        case 'paragraph':
          const paragraph = figma.createText();
          paragraph.fontSize = 16;
          paragraph.characters = block.children[0].value;
          doc.appendChild(paragraph);
          break;
        default:
          break;
      }
    }
  }
};
async function CreateMarkdownComponents() {
  //H1
  const fontInterBold = { family: 'Inter', style: 'Bold' };
  const OrganizeComponent = figma.createFrame();
  OrganizeComponent.layoutMode = 'VERTICAL';
  OrganizeComponent.itemSpacing = 24;
  OrganizeComponent.primaryAxisSizingMode = 'AUTO';
  OrganizeComponent.counterAxisSizingMode = 'AUTO';

  //Load Fonts
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync(fontInterBold);

  //Build Heading 1
  let h1 = figma.createText();
  h1.characters = settings.h1.characters;
  h1.fontSize = settings.h1.fontSize;
  h1.fontName = fontInterBold;
  h1.name = 'text';
  const H1_Component = figma.createComponent();
  H1_Component.layoutMode = 'HORIZONTAL';
  H1_Component.counterAxisSizingMode = 'AUTO';
  H1_Component.name = settings.h1.parent.name;
  H1_Component.paddingBottom = settings.h1.parent.paddingBottom;
  H1_Component.appendChild(h1);
  OrganizeComponent.appendChild(H1_Component);
  Component_IDs.push(H1_Component.id);

  //Build Section
  const Page = figma.createPage();
  Page.name = '🧩 - Figma.MD Components';
  const Section = figma.createSection();
  Page.appendChild(Section);
  Section.name = 'Figma.md';
  Section.appendChild(OrganizeComponent);
}

//@ts-ignore
async function CreateText(text) {
  const paragraphFrame = figma.createFrame();
  paragraphFrame.layoutMode = 'VERTICAL';
  paragraphFrame.counterAxisSizingMode = 'FIXED';
  paragraphFrame.primaryAxisSizingMode = 'AUTO';
  paragraphFrame.resize(400, 400);

  //Load fonts
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

  let words = text.split('');
  let row = figma.createFrame();
  row.itemSpacing = 0;
  row.layoutMode = 'HORIZONTAL';
  row.layoutAlign = 'STRETCH';
  row.counterAxisSizingMode = 'AUTO';
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (row.width < paragraphFrame.width) {
      const wordText = figma.createText();
      wordText.characters = word + ' ';
      row.appendChild(wordText);
    } else {
      //make new row
    }
  }
}
