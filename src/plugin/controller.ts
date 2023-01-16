import { clone } from '@figma-plugin/helpers';
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
          switch (block.depth) {
            case 1:
              //Heading 1 Padding Frame settings
              const h1Frame = figma.createFrame();
              h1Frame.primaryAxisSizingMode = 'FIXED';
              h1Frame.counterAxisSizingMode = 'AUTO';
              h1Frame.layoutMode = 'HORIZONTAL';
              h1Frame.layoutAlign = 'STRETCH';
              h1Frame.name = 'Heading 1';
              //Heading 1 settings
              const h1 = figma.createText();
              h1.fontSize = 32;
              h1.layoutGrow = 1;
              h1Frame.paddingBottom = 16;
              h1.characters = block.children[0].value;
              h1Frame.appendChild(h1);
              doc.appendChild(h1Frame);
              h1.name = 'value';
              break;
            case 2:
              //Heading 1 Padding Frame settings
              const h2Frame = figma.createFrame();
              h2Frame.primaryAxisSizingMode = 'FIXED';
              h2Frame.counterAxisSizingMode = 'AUTO';
              h2Frame.layoutMode = 'HORIZONTAL';
              h2Frame.layoutAlign = 'STRETCH';
              h2Frame.name = 'Heading 2';
              //Heading 1 settings
              const h2 = figma.createText();
              h2.fontSize = 28;
              h2.layoutGrow = 1;
              h2Frame.paddingBottom = 16;
              h2.characters = block.children[0].value;
              h2Frame.appendChild(h2);
              doc.appendChild(h2Frame);
              h2.name = '$value';
              break;
            case 3:
              //Heading 1 Padding Frame settings
              const h3Frame = figma.createFrame();
              h3Frame.primaryAxisSizingMode = 'FIXED';
              h3Frame.counterAxisSizingMode = 'AUTO';
              h3Frame.layoutMode = 'HORIZONTAL';
              h3Frame.layoutAlign = 'STRETCH';
              h3Frame.name = 'Heading 3';
              //Heading 1 settings
              const h3 = figma.createText();
              h3.fontSize = 20;
              h3.layoutGrow = 1;
              h3Frame.paddingBottom = 16;
              h3.characters = block.children[0].value;
              h3Frame.appendChild(h3);
              doc.appendChild(h3Frame);
              h3.name = '$value';
              break;
          }
          break;
        case 'paragraph':
          //Paragraph frame
          const pFrame = figma.createFrame();
          pFrame.layoutMode = 'HORIZONTAL';
          pFrame.primaryAxisSizingMode = 'FIXED';
          pFrame.counterAxisSizingMode = 'AUTO';
          pFrame.layoutMode = 'HORIZONTAL';
          pFrame.layoutAlign = 'STRETCH';
          pFrame.paddingBottom = 16;
          pFrame.name = 'Paragraph';
          //Paragraph text
          const paragraph = figma.createText();
          paragraph.fontSize = 16;
          paragraph.characters = block.children[0].value;
          pFrame.appendChild(paragraph);
          doc.appendChild(pFrame);
          break;
        case 'thematicBreak':
          //HR FRAME
          const hrFrame = figma.createFrame();
          hrFrame.layoutMode = 'HORIZONTAL';
          hrFrame.primaryAxisSizingMode = 'FIXED';
          hrFrame.layoutAlign = 'STRETCH';
          hrFrame.layoutGrow = 0;
          hrFrame.name = 'Horizontal Rule';
          hrFrame.paddingBottom = 16;
          hrFrame.paddingTop = 16;
          hrFrame.resize(1, 1);
          hrFrame.counterAxisSizingMode = 'AUTO';
          //HR
          const hr = figma.createFrame();
          hr.layoutMode = 'HORIZONTAL';
          hr.primaryAxisSizingMode = 'FIXED';
          hr.counterAxisSizingMode = 'FIXED';
          hr.layoutAlign = 'INHERIT';
          hr.layoutGrow = 1;
          hr.name = 'Fill';
          const fills = clone(hr.fills);
          fills[0].color.r = 210 / 255;
          fills[0].color.b = 210 / 255;
          fills[0].color.g = 210 / 255;
          hr.fills = fills;
          hr.resize(1, 1);
          hrFrame.appendChild(hr);
          doc.appendChild(hrFrame);

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
