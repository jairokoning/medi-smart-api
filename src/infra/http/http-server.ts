import express from "express";
import bodyParser from "body-parser";

export default interface HttpServer {
  register(method: string, url: string, callback: Function): void;
  listen(port: number): void;
}

export class ExpressAdapter implements HttpServer {
  app: any;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    // this.app.use(bodyParser.json({ limit: '150mb' }))
    this.app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));
    // this.app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
  }

  register(method: string, url: string, callback: Function): void {
    this.app[method](url.replace(/\{|\}/g, ""), async (req: any, res: any) => {
      try {
        const output = await callback(req.params, req.query, req.body);
        res.json(output);
      } catch (e: any) {
        let statusCode = 500;
        let errorCode = "Error";
        switch (e.message) {
          case "Leitura do mês já realizada":
            statusCode = 409;
            errorCode = "DOUBLE_REPORT";
            break;
          case "Código de cliente inválido":
          case "Imagem não é Base64 válida":
          case "Data de leitura invalida":
          case "Valor inválido":
            statusCode = 400;
            errorCode = "INVALID_DATA";
            break;
          case "Leitura não encontrada":
            statusCode = 404;
            errorCode = "MEASURE_NOT_FOUND";
            break;
          case "Leitura já confirmada":
            statusCode = 409;
            errorCode = "CONFIRMATION_DUPLICATE";
            break;
          case "Tipo de medição não permitida":
            statusCode = 400;
            errorCode = "INVALID_TYPE";
            break;
          case "Nenhuma leitura encontrada":
            statusCode = 404;
            errorCode = "MEASURES_NOT_FOUND";
            break;
          default:
            statusCode = 422;
            break;
        }
        res.status(statusCode).json({
          error_code: errorCode,
          error_description: e.message
        });
      }
    });
  }

  listen(port: number): void {
    this.app.listen(port);
    console.log("🚀🚀🚀 App running on port " + port);
  }

}