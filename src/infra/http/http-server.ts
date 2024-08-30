import express from "express";
import bodyParser from "body-parser";
import path from "path";

export default interface HttpServer {
  register(method: string, url: string, callback: Function): void;
  listen(port: number): void;
}

export class ExpressAdapter implements HttpServer {
  app: any;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(bodyParser.json({ limit: '150mb' }))
    this.app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));
    this.app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
  }

  register(method: string, url: string, callback: Function): void {
    this.app[method](url.replace(/\{|\}/g, ""), async (req: any, res: any) => {
      try {
        const output = await callback(req.params, req.body);
        res.json(output);
      } catch (e: any) {
        res.status(422).json({
          message: e.message
        });
      }
    });
  }

  listen(port: number): void {
    this.app.listen(port);
    console.log("🚀🚀🚀 App running on port " + port);
  }

}