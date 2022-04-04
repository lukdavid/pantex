import { render } from "mustache";
import { readFile, access } from "fs/promises";
import { constants } from "fs";

const renderTemplate = async (
  templateId: string,
  content: string,
  view: Object
) => {
  const templatePath = `templates/${templateId}.tex`;
  await access(templatePath, constants.F_OK).catch((err) => {
    // check files exists
    console.log(`unknown template ${templateId}`);
    throw err;
  });

  const template = (await readFile(templatePath)).toString();
  return render(template, { ...view, content });
};

export default renderTemplate;
