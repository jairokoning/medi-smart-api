import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import LargeLanguageModelGateway, { LLMError } from "../../application/gateway/llm-gateway";

export default class LargeLanguageModelGatewayGemini implements LargeLanguageModelGateway {
  async uploadImage(image: string): Promise<{ image_url: string; measure_value: number; status: string; error?: LLMError | undefined; }> {
    //const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imageMimeType = this.getMimeType(image);
    const rootDir = path.join(__dirname, '../../../');
    const imageDir = path.join(rootDir, 'uploads', 'images');
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
    const imageName = `${crypto.randomUUID()}.${imageMimeType.split('/')[1]}`;
    const imagePath = path.join(imageDir, imageName)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(imagePath, buffer);
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);
    const uploadResult = await fileManager.uploadFile(
      imagePath,
      {
        mimeType: imageMimeType,
        displayName: imageName.split('.')[0],
      },
    );
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "Analyze the water/gas meter shown in this image and return the measurement value. Be careful to only return the measurement value as an integer. If there is no measurement, return 0.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);
    const match = result.response.text().match(/\d+/);
    const measure_value = match ? parseInt(match[0], 10) : 0;
    const image_url = `http://localhost:80/uploads/images/${imageName}`;
    return {
      image_url,
      measure_value: measure_value,
      status: uploadResult.file.state,
      error: uploadResult.file.error,
    }
  }

  getMimeType(image: string) {
    const matchMimeType = image.match(/^data:(.+);base64,/);
    if (matchMimeType) {
      return matchMimeType[1];
    }
    switch (true) {
      case image.startsWith("iVBORw0KGgo"):
        return "image/png";
      case image.startsWith("/9j/"):
        return "image/jpeg";
      case image.startsWith("UklGR"):
        return "image/webp";
      default:
        return "image/jpeg";
    }
  }

}