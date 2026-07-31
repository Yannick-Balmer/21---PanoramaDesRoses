import { raw } from 'express';
import type {
  NextFunction,
  Request,
  Response,
} from 'express';

type RequestWithRawBody = Request & {
  rawBody?: Buffer;
};

const rawParser = raw({
  type: 'application/json',
});

export function rawBodyMiddleware(
  request: RequestWithRawBody,
  response: Response,
  next: NextFunction,
): void {

  console.log('Avant rawParser');
console.log('Buffer ?', Buffer.isBuffer(request.body));
console.log('Type   :', typeof request.body);
console.log('Body   :', request.body);

  rawParser(request, response, (error) => {
    if (error) {
      next(error);
      return;
    }

    request.rawBody = request.body as Buffer;

    console.log('Après rawParser');
    console.log('Buffer ?', Buffer.isBuffer(request.body));
    console.log('Type   :', typeof request.body);

    next();
  });
}



// import * as bodyParser from 'body-parser';

// export function rawBodyMiddleware(req: any, res: any, next: any) {
//   bodyParser.raw({ type: 'application/json' })(req, res, (err) => {
//     if (err) {
//       return next(err);
//     }
//     // Stripe veut absolument req.rawBody
//     req.rawBody = req.body;
//     next();
//   });
// }




// import { NextFunction, Request, Response } from 'express';
// import { raw } from 'body-parser';

// export const rawBodyMiddleware = raw({
//   type: 'application/json',
// });