import { Request, Response } from 'express';

export function analyzeFramework(req: Request, res: Response) {
    res.send({
        message: 'Analyzer will work here..',
      });
}