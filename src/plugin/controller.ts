import { clone } from '@figma-plugin/helpers';
figma.showUI(__html__, { height: 850, width: 500 });

figma.ui.onmessage = async (msg) => {
  if (msg.type == 'setMarkdown') {
    let markdownData = {
      id: figma.currentPage.selection[0].id,
      useDefault: msg.components == null ? true : false,
      markdown: msg.markdown,
    };
    BuildMarkdown(markdownData);
  }

  async function BuildMarkdown(markdownData) {
    let doc = figma.getNodeById(markdownData.id) as FrameNode;
    try {
      if (!doc) throw Error('Document does not exist');
      if (markdownData.useDefault) {
        //Load default font
        await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
      }
      //Remove all children to update according to the doc.
      if (doc.children.length > 0) {
        doc.children.forEach((element) => {
          element.remove();
        });
      }
    } catch (error) {
      for (let i = 0; i < markdownData.markdown.length; i++) {
        const block = markdownData.markdown[i];
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
  }
};

function GetParagraph(data, Parent) {
  //Create Paragraph
  const Parapgrah = CreateType('Paragraph');
  data.children.forEach((e) => {
    GetTextType(e, Parapgrah);
  });
}

function GetTextType(data, Parent) {
  switch (data.type) {
    case 'inlineCode':
      break;
    case 'emphasis':
      break;
    case 'strong':
      break;
    case 'link':
      break;
    default:
      break; //Just plain text
  }
}

async function CreateType(type: string) {
  switch (type) {
    case 'Paragraph':
      const pFrame = figma.createFrame();
      pFrame.layoutMode = 'HORIZONTAL';
      pFrame.primaryAxisSizingMode = 'FIXED';
      pFrame.counterAxisSizingMode = 'AUTO';
      pFrame.layoutMode = 'HORIZONTAL';
      pFrame.layoutAlign = 'STRETCH';
      pFrame.paddingBottom = 16;
      pFrame.name = 'Paragraph';
      return pFrame;
    case 'Heading':
      return;
    case 'thematicBreak':
      return;
    case 'list':
      return;
    case 'listItem':
      return;
    case 'HTML':
    return;
    case 'Blockqoute'
  }
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
